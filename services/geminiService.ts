import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Threat, ZoonoticAlert, EnvironmentalAlert, WildlifeAlert, DisasterAlert, VaccineInventoryItem } from "../types";

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// A helper to wrap API calls with retry logic for rate limiting
const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 2000, // Start with a 2-second delay
  backoffFactor = 2
): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      let isRateLimitError = false;

      if (error instanceof Error) {
        const message = error.message || '';
        // Check for common rate limit phrases and status codes
        if (message.includes('429') || message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('resource_exhausted')) {
           isRateLimitError = true;
        } else {
            // Fallback to parse JSON from the error message
            try {
                const jsonMatch = message.match(/{.*}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed?.error?.code === 429 || parsed?.error?.status === 'RESOURCE_EXHAUSTED') {
                        isRateLimitError = true;
                    }
                }
            } catch (parseError) {
                // Not a JSON error, proceed
            }
        }
      }
      
      if (isRateLimitError) {
        // Add jitter to avoid synchronized retries
        const jitter = Math.random() * 1000;
        const waitTime = initialDelay * Math.pow(backoffFactor, i) + jitter;
        console.warn(`Rate limit exceeded. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await delay(waitTime);
      } else {
        // Not a rate limit error, throw it immediately
        throw error;
      }
    }
  }
  throw lastError;
};

export const getAiAnalysis = async (dataSummary: string): Promise<string> => {
  try {
    const prompt = `You are Aegis, a biosurveillance AI. Analyze the following data summary and provide a concise, actionable threat analysis report for public health officials.
The report must be in Markdown format and include:
- A main heading '### Threat Assessment'.
- A 'Key Takeaways' section with critical points in bold.
- A bulleted list of 'Recommendations'.

Data Summary:
${dataSummary}`;

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    }));
    
    return response.text;
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
      throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
    }
    throw new Error("The AI analysis service is currently unavailable. Please try again later.");
  }
};

export const getThreatsAnalysis = async (threats: Threat[]): Promise<Record<string, string>> => {
    if (!threats || threats.length === 0) {
        return {};
    }

    try {
        const threatsPrompts = threats.map(t => `- For "${t.name}", provide a summary based on: "${t.summaryPrompt}"`).join('\n');

        const prompt = `
You are Aegis, a biosurveillance AI. Analyze the following list of infectious disease threats.
For each threat, provide a single, concise sentence summary as requested.
Return the output as a single valid JSON object where each key is the exact threat name and the value is the generated summary.

Threats to analyze:
${threatsPrompts}
`;

        const schemaProperties = threats.reduce((acc, threat) => {
            acc[threat.name] = { 
                type: Type.STRING,
                description: `A one-sentence summary for ${threat.name}.`
            };
            return acc;
        }, {} as Record<string, { type: Type; description: string; }>);

        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: schemaProperties,
            },
          },
        }));
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        }
        
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error generating bulk threat spectrum analysis after retries:", error);
        const errorResult: Record<string, string> = {};
        const isRateLimit = error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'));
        
        threats.forEach(t => {
            errorResult[t.name] = isRateLimit ? "Rate limit reached. Try again." : "AI analysis unavailable.";
        });
        return errorResult;
    }
};


export const getOneHealthRecommendations = async (indexSummary: string): Promise<string> => {
  try {
    const prompt = `You are Aegis, a strategic public health AI advisor.
Based on the following One Health Index summary, provide a high-level, 3-point strategic action plan for national public health authorities.
The plan should be in Markdown format, with a main heading '### Strategic Recommendations' and a bulleted list. Each point should be concise and actionable.

Index Summary:
${indexSummary}`;

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a more powerful model for strategic advice
      contents: prompt,
    }));

    return response.text;
  } catch (error) {
    console.error("Error generating One Health recommendations:", error);
    if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
      throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
    }
    throw new Error("The AI recommendation service is currently unavailable. Please try again later.");
  }
};

export const getStateSpecificRecommendations = async (stateName: string, stateDataSummary: string): Promise<string> => {
    try {
        const prompt = `
You are Aegis, a specialized public health AI strategist for India. Your task is to generate a state-specific action plan for ${stateName}.
The plan must be tailored to the state's unique context provided in the data summary.

Output the plan in Markdown format with the following structure:
- A main heading: '### Action Plan: ${stateName}'
- A section for '**1. Immediate Public Health Directives**' with at least two targeted, actionable bullet points for local health bodies.
- A section for '**2. Healthcare System Coordination**' with recommendations on how to mobilize state-specific institutions.
- A section for '**3. Public Awareness Campaign**' with culturally and linguistically relevant suggestions for ${stateName}.

Data Summary:
${stateDataSummary}
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating recommendations for ${stateName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI state-specific recommendation service is currently unavailable.");
    }
};

export const getViralStrainAnalysis = async (strainName: string, promptDetails: string): Promise<string> => {
    try {
        const prompt = `
You are an expert virologist AI. Your task is to provide a concise analysis of the viral strain: **${strainName}**.
Use the following details to inform your analysis: ${promptDetails}.

Output the analysis in Markdown format with this exact structure:
- A main heading '### Analysis: ${strainName}'
- A bolded line for '**Transmissibility**:' followed by a brief, one-sentence explanation.
- A bolded line for '**Severity**:' followed by a brief, one-sentence explanation.
- A bolded line for '**Key Mutations**:' followed by a brief, one-sentence explanation of relevant genetic markers, if known.
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating viral strain analysis for ${strainName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI viral strain analysis service is currently unavailable.");
    }
};

export const getDrugInventoryRecommendations = async (contextName: string, inventorySummary: string): Promise<string> => {
    try {
        const prompt = `
You are Aegis, an AI logistics and supply chain expert for public health crises. Your task is to analyze the drug inventory for ${contextName} and provide an actionable optimization plan.

The plan must be concise, data-driven, and in Markdown format with the following structure:
- A main heading: '### Inventory Optimization Plan: ${contextName}'
- A section for '**1. Procurement Priorities (Urgent)**' with a bulleted list of drugs that need immediate restocking, mentioning the urgency based on Days of Supply (DoS).
- A section for '**2. Stock Redistribution**' with suggestions on moving supplies to high-demand areas if applicable, based on the provided threat summary.
- A section for '**3. Cost-Saving & Efficiency**' with recommendations for cost-effective procurement or alternative drug considerations.

Current Inventory & Threat Data:
${inventorySummary}
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating drug inventory recommendations for ${contextName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI inventory optimization service is currently unavailable.");
    }
};

export const getDistrictActionPlan = async (districtName: string, stateName: string, summary: string): Promise<string> => {
    try {
        const prompt = `
You are Aegis, a hyper-local public health AI strategist. Generate a grassroots-level action plan for **${districtName}**, within the state of **${stateName}**.
The plan must be highly specific, actionable for on-the-ground teams, and integrate community resources.

Output the plan in Markdown format with this structure:
- A main heading: '### Grassroots Action Plan: ${districtName}'
- **1. Community Health Workers (ASHAs)**: Specific directives for ASHAs, like door-to-door symptom surveys in high-risk zones and distributing information pamphlets.
- **2. Sanitation & Vector Control Teams**: Precise locations for immediate action (e.g., 'fogging in Fort Kochi tourist areas', 'clearing stagnant water near Mattancherry market').
- **3. Local Transport & Logistics**: How to involve local resources like auto-rickshaw drivers for public announcements or transporting test samples.
- **4. Public Awareness**: Simple, clear messages for local announcement systems, focusing on hygiene and early symptom reporting.

Data Summary for ${districtName}:
${summary}
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating action plan for ${districtName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI district action plan service is currently unavailable.");
    }
};

export const getZoonoticActionPlan = async (alert: ZoonoticAlert): Promise<string> => {
    try {
        const prompt = `
You are Aegis, a public health AI specializing in zoonotic disease containment.
For a confirmed **${alert.name}** alert in **${alert.location}**, generate a 3-tier strategic action plan in Markdown format. The plan must be sector-specific and actionable for government officials.

- A main heading: '### Strategic Action Plan: ${alert.name}'
- **1. Veterinary & Animal Health Response**: Actions for veterinary departments (e.g., animal surveillance, ring vaccination, culling protocols, movement restrictions).
- **2. Public Health & Medical Response**: Actions for health departments (e.g., human case contact tracing, quarantine guidelines, PPE protocols for healthcare workers, diagnostic capacity).
- **3. Community & Public Communication**: Actions for public information officers (e.g., clear messaging to affected communities, addressing misinformation, promoting safe practices like food handling or avoiding contact with specific animals).
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating zoonotic action plan for ${alert.name}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI zoonotic action plan service is currently unavailable.");
    }
};

export const getWastewaterActionPlan = async (alert: EnvironmentalAlert): Promise<string> => {
    try {
        const prompt = `
You are Aegis, an AI public health strategist focused on environmental health.
For a confirmed high signal of **${alert.name}** in the wastewater system at **${alert.location}**, generate a 3-part optimization and response plan in Markdown format. The plan must be actionable for government and utility officials.

- A main heading: '### Optimization & Response Plan: ${alert.name}'
- **1. Targeted Public Health Intervention**: Actions for health officials targeting the specific upstream catchment area (e.g., deploy mobile health clinics, launch hyperlocal awareness campaigns on hygiene and symptoms, alert local doctors).
- **2. Water & Infrastructure Response**: Actions for the municipal water authority (e.g., increase chlorine levels in drinking water distribution for the area, inspect for cross-contamination, flush sewer lines).
- **3. Proactive Surveillance Enhancement**: Next steps to enhance monitoring (e.g., increase sampling frequency at the sentinel site, deploy rapid tests in the community, initiate syndromic surveillance at local clinics).
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating wastewater action plan for ${alert.name}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI wastewater action plan service is currently unavailable.");
    }
};

export const getWildlifeActionPlan = async (alert: WildlifeAlert): Promise<string> => {
    try {
        const prompt = `
You are Aegis, an AI public health and wildlife management strategist.
For a detected wildlife disease event: **${alert.disease}** in **${alert.species}** at **${alert.location}**, generate a 3-tier strategic action plan in Markdown format. The plan must be actionable for government officials.

- A main heading: '### Strategic Action Plan: ${alert.disease} in ${alert.species}'
- **1. Wildlife & Environmental Response**: Actions for wildlife services and forestry departments (e.g., population surveys, containment zones, carcass disposal protocols, habitat management).
- **2. Public Health Interface**: Actions for health departments, especially considering a **'${alert.riskToHumans}'** risk to humans (e.g., issue public advisories, set up sentinel surveillance in nearby human populations, alert local medical professionals).
- **3. Livestock & Agricultural Protection**: Actions to prevent spillover to domestic animals, if applicable (e.g., biosecurity protocols for farms, vaccination campaigns, movement restrictions).
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating wildlife action plan for ${alert.disease}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI wildlife action plan service is currently unavailable.");
    }
};

export const getDisasterDiseaseActionPlan = async (alert: DisasterAlert): Promise<string> => {
    try {
        const prompt = `
You are Aegis, an AI strategist for public health in disaster scenarios.
For a **'${alert.severity}'** **${alert.disasterType}** event in **${alert.location}**, generate a 3-part Public Health Action Plan in Markdown format. The plan must focus on mitigating the associated disease risks: **${alert.associatedDiseaseRisks.join(', ')}**.

- A main heading: '### Public Health Action Plan: ${alert.disasterType} in ${alert.location}'
- **1. Immediate Health & Sanitation Measures**: Actions for immediate deployment (e.g., establish mobile medical clinics, distribute hygiene kits, ensure safe drinking water, set up emergency sanitation facilities).
- **2. Disease Surveillance & Control**: Actions to monitor for and control outbreaks (e.g., deploy rapid diagnostic tests for priority diseases, initiate syndromic surveillance in shelters, implement vector control measures like fogging).
- **3. Public Health Communication**: Clear, simple messages for affected populations (e.g., how to purify water, identify symptoms of key diseases, where to seek medical help, and address misinformation).
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating disaster disease action plan for ${alert.disasterType}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI disaster response plan service is currently unavailable.");
    }
};

export const getVaccineOptimizationPlan = async (contextName: string, population: string, inventory: VaccineInventoryItem[], threatSummary: string): Promise<string> => {
    try {
        const inventorySummary = inventory.map(item => 
            `- ${item.name} (${item.type}): Targets ${item.targetPathogen}, ${item.dosesAvailable.toLocaleString()} doses available, ${item.monthlyProductionCapacity.toLocaleString()} doses/month capacity, ${item.efficacy}% efficacy.`
        ).join('\n');

        const prompt = `
You are Aegis, an AI strategist specializing in epidemiology and public health logistics. Your task is to create a vaccine optimization plan for **${contextName}** (Population: ${population}).

The plan must be data-driven, actionable for government health authorities, and presented in Markdown format with the following structure:

- A main heading: '### Vaccine Strategy & Optimization: ${contextName}'

- **1. Strategic Production & Procurement Targets (Next 6 Months)**:
  - Based on the current threats and inventory, recommend specific production/procurement targets for each vaccine type.
  - Provide a clear rationale. Example: "Ramp up Dengue vaccine production by 2M doses/month due to the DENV-2 outbreak."

- **2. National/State Stockpile Inventory Strategy**:
  - Recommend ideal stockpile levels (e.g., 3-month supply for high-threat pathogens).
  - Consider vaccine shelf-life and suggest a rotation policy if applicable.
  - Advise on strategic reserves for novel or unexpected threats.

- **3. Prioritized Distribution Plan**:
  - Identify high-risk regions or demographics that should be prioritized for vaccination campaigns.
  - Suggest a phased rollout plan if supply is limited.

- **4. Wastage Mitigation & Efficiency**:
  - Recommend 2-3 specific strategies to minimize vaccine wastage (e.g., improving cold chain logistics, using smaller vial sizes for rural areas, implementing a just-in-time delivery system for high-volume centers).

**Current Data:**

**Threat Assessment:**
${threatSummary}

**Vaccine Inventory Status:**
${inventorySummary}
`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        }));

        return response.text;
    } catch (error) {
        console.error(`Error generating vaccine optimization plan for ${contextName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI vaccine optimization service is currently unavailable.");
    }
};
