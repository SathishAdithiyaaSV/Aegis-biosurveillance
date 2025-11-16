import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Threat, ZoonoticAlert, EnvironmentalAlert, WildlifeAlert, DisasterAlert, VaccineInventoryItem, Intervention, SimulationResult, TimeSeriesData, PredictiveDataPoint, GenomicSignal, BioThreat, LabStatus, BiologicalWeaponSignal, ChemicalWeaponSignal, LivestockAlert, NationalBiosecurityIndexData, SlaughterhouseData } from "../types";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY! });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// A helper to wrap API calls with retry logic
const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 2000,
  backoffFactor = 2
): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      let isRetryableError = false;

      if (error instanceof Error) {
        const message = error.message || '';
        // Check for common retryable phrases and status codes (429, 500, 503)
        if (message.includes('429') || message.includes('500') || message.includes('503') || message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('resource_exhausted')) {
           isRetryableError = true;
        } else {
            // Fallback to parse JSON from the error message
            try {
                const jsonMatch = message.match(/{.*}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if ([429, 500, 503].includes(parsed?.error?.code) || parsed?.error?.status === 'RESOURCE_EXHAUSTED') {
                        isRetryableError = true;
                    }
                }
            } catch (parseError) {
                // Not a JSON error, proceed
            }
        }
      }
      
      if (isRetryableError) {
        // Add jitter to avoid synchronized retries
        const jitter = Math.random() * 1000;
        const waitTime = initialDelay * Math.pow(backoffFactor, i) + jitter;
        console.warn(`Retryable error detected. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await delay(waitTime);
      } else {
        // Not a retryable error, throw it immediately
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

    const response = await withRetry<GenerateContentResponse>(() => {
        const ai = getAiClient();
        return ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
    });
    
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
Return the output as a single valid JSON object where each key is the exact threat name and the value is the generated summary. Ensure the JSON is well-formed and all strings are properly escaped.

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

        const response = await withRetry<GenerateContentResponse>(() => {
          const ai = getAiClient();
          return ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                type: Type.OBJECT,
                properties: schemaProperties,
                },
            },
          });
        });
        
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

    const response = await withRetry<GenerateContentResponse>(() => {
      const ai = getAiClient();
      return ai.models.generateContent({
        model: 'gemini-2.5-flash', // Using a more powerful model for strategic advice
        contents: prompt,
      });
    });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating disaster disease action plan for ${alert.disasterType}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI disaster response plan service is currently unavailable.");
    }
};

export const getBiothreatAnalysis = async (threats: BioThreat[]): Promise<Record<string, string>> => {
    if (!threats || threats.length === 0) return {};
    try {
        const threatsPrompts = threats.map(t => `- For "${t.agent}", provide a summary based on: "${t.summaryPrompt}"`).join('\n');
        const prompt = `
You are Aegis, a bio-warfare strategic AI analyst for the Department of Defense.
Analyze the following list of bio-threat agents. For each threat, provide a single, concise sentence summary as requested.
Return the output as a single valid JSON object where each key is the exact threat agent name and the value is the generated summary. Ensure the JSON is well-formed and all strings are properly escaped.

Threats to analyze:
${threatsPrompts}
`;
        const schemaProperties = threats.reduce((acc, threat) => {
            acc[threat.agent] = { 
                type: Type.STRING,
                description: `A one-sentence strategic summary for ${threat.agent}.`
            };
            return acc;
        }, {} as Record<string, { type: Type; description: string; }>);

        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash', // Use flash for strategic analysis
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.OBJECT, properties: schemaProperties },
                },
            });
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        }
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating bulk bio-threat analysis:", error);
        const errorResult: Record<string, string> = {};
        threats.forEach(t => {
            errorResult[t.agent] = "AI analysis currently unavailable.";
        });
        return errorResult;
    }
};

export const getLabNetworkAnalysis = async (labStatuses: string): Promise<string> => {
  try {
    const prompt = `You are Aegis, a national biosecurity AI. Analyze the readiness of the national BSL-3/4 lab network based on the following data. Provide a concise, one-paragraph summary of the network's current state, highlighting any potential vulnerabilities or strengths.

Data:
${labStatuses}`;

    const response = await withRetry<GenerateContentResponse>(() => {
        const ai = getAiClient();
        return ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating lab network analysis:", error);
    if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
      throw new Error("AI service is busy. Please try again.");
    }
    throw new Error("AI analysis for lab network is unavailable.");
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
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating vaccine optimization plan for ${contextName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI vaccine optimization service is currently unavailable.");
    }
};

export const getSimulationAnalysis = async (stateName: string, contextSummary: string, intervention: Intervention, baselineForecast: number[]): Promise<SimulationResult> => {
    try {
        const prompt = `
You are Aegis, a strategic public health AI advisor. Your task is to create a clear, concise summary of a disease outbreak simulation for government officials and judges. The tone should be authoritative, direct, and easily understandable, avoiding technical jargon.

**Simulation Context:**
- **Location:** ${stateName}
- **Current Situation Summary:** ${contextSummary}
- **Baseline Forecast (Projected weekly cases with NO new action):** ${baselineForecast.join(', ')}.

**Proposed Intervention to Analyze:**
- **Name:** ${intervention.name}
- **Description:** ${intervention.description}

**Your Tasks:**
1.  Project the new weekly case counts for the next 4 weeks assuming the proposed intervention is successfully implemented.
2.  Generate a narrative summary that explains the situation and the simulation's outcome in plain language.

**Output Format:**
Return a single, valid JSON object with the following structure. Ensure the JSON is well-formed and all strings are properly escaped.
{
  "projectedCases": [
    // An array of 4 integers representing the projected new weekly cases for Week +1 through Week +4 WITH the intervention.
  ],
  "narrativeSummary": "
    // A Markdown-formatted summary for decision-makers. It must include these sections:
    // ### Executive Summary
    // **Current Situation:** A one-sentence summary of the current problem.
    // **Projected Trajectory (No Action):** A one-sentence explanation of what will happen if no new action is taken, based on the baseline forecast.
    // **Impact of Intervention ('${intervention.name}'):** A clear, data-driven explanation of how the intervention changes the trajectory. Compare the projected cases with the baseline forecast (e.g., 'This action is projected to avert an estimated X cases over 4 weeks.').
    // **Strategic Recommendation:** A concluding one-sentence recommendation on whether to proceed with the intervention.
  "
}
`;
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                        projectedCases: {
                          type: Type.ARRAY,
                          items: { type: Type.INTEGER },
                          description: "An array of exactly 4 integers for the projected weekly cases."
                        },
                        narrativeSummary: {
                          type: Type.STRING,
                          description: "A Markdown-formatted summary of the simulation's impact for decision-makers."
                        }
                      }
                    }
                }
            });
        });

        let jsonStr = response.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        }
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error(`Error generating simulation for ${stateName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI simulation service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI simulation service is currently unavailable.");
    }
};

export const getChartInterpretation = async (
    stateName: string,
    diseaseName: string,
    historicalData: TimeSeriesData[],
    baselineForecast: PredictiveDataPoint[],
    simulatedData: PredictiveDataPoint[],
    interventionName: string
): Promise<string> => {
    try {
        const historicalValues = historicalData.map(d => d.value).join(', ');
        const baselineValues = baselineForecast.map(d => d.value).join(', ');
        const simulatedValues = simulatedData.map(d => d.value).join(', ');

        const prompt = `
You are Aegis, a data visualization analyst AI. Your task is to interpret a chart showing a disease outbreak forecast for public health officials. Explain the story the data tells in a clear, narrative format.

**Chart Context:**
- **Location:** ${stateName}
- **Disease:** ${diseaseName}
- **Intervention Simulated:** ${interventionName}

**Chart Data:**
- **Recent Historical Trend (Weekly Cases):** ${historicalValues}
- **Baseline Forecast (Projected weekly cases with no new action):** ${baselineValues}
- **Simulated Outcome (Projected weekly cases with the intervention):** ${simulatedValues}

**Your Task:**
Generate a Markdown-formatted interpretation of the chart. It must include these sections:

### Chart Interpretation

**1. The Historical Trend:** Briefly describe the pattern of the historical data line (blue line). Is it rising sharply, slowly, or is it stable?

**2. The Baseline Forecast (Yellow Dashed Line):** Explain what this line represents and describe its trajectory. Does it predict the situation will worsen, improve, or stay the same if no action is taken?

**3. The Simulated Impact (Green Dashed Line):** Explain how the '${interventionName}' intervention changes the forecast. Describe the shape of the green line compared to the yellow one. Does it flatten the curve, cause a decline, or just slow the rate of increase? Quantify the difference at the end of the 4-week period.
`;

        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating chart interpretation for ${stateName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI interpretation service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI chart interpretation service is currently unavailable.");
    }
};

export const getGenomicActionPlan = async (signal: GenomicSignal): Promise<string> => {
    try {
        const prompt = `
You are Aegis, an AI public health strategist specializing in viral genomics.
For a confirmed genomic signal: **${signal.strainName}** detected in **${signal.location}**, generate a 3-tier strategic action plan in Markdown format. The signal's key characteristic is **'${signal.significance}'**.

- A main heading: '### Genomic Response Plan: ${signal.strainName}'
- **1. Enhanced Surveillance & Sequencing**: Actions for genomic surveillance teams (e.g., prioritize sequencing of samples from the region, increase sampling frequency, screen for specific mutations).
- **2. Clinical & Public Health Guidance**: Actions for health departments and clinicians (e.g., update diagnostic protocols, issue alerts to hospitals about potential changes in disease presentation or treatment efficacy, revise public health messaging).
- **3. Countermeasure Assessment**: Actions to evaluate existing vaccines and therapeutics against this new variant (e.g., recommend laboratory studies for vaccine effectiveness, assess antiviral drug susceptibility).

Additional Context: ${signal.summary}
`;
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating genomic action plan for ${signal.strainName}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI genomic action plan service is currently unavailable.");
    }
};

export const getBiologicalWeaponActionPlan = async (alert: BiologicalWeaponSignal): Promise<string> => {
    try {
        const prompt = `
You are Aegis, a bio-warfare AI response coordinator.
For a **${alert.status}** signal of **${alert.agent}** detected via **${alert.sourceType}** in **${alert.location}**, generate a 3-tier strategic action plan in Markdown format for defense and public health officials.

- A main heading: '### Biological Threat Response Plan: ${alert.agent}'
- **1. Immediate Containment & Decontamination**: Actions for HAZMAT and first responders (e.g., establish a secure perimeter, deploy decontamination units, issue shelter-in-place orders for the affected grid).
- **2. Public Health & Medical Countermeasures**: Actions for health officials (e.g., initiate mass prophylaxis protocols for the exposed population, prepare hospitals for specific symptoms, deploy mobile diagnostic labs).
- **3. Attribution & Intelligence**: Next steps for investigative bodies (e.g., secure environmental samples for forensic analysis, review intelligence chatter for related keywords, deploy additional sensors to track plume).
`;
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating biological weapon action plan for ${alert.agent}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI biological threat response service is currently unavailable.");
    }
};

export const getChemicalWeaponActionPlan = async (alert: ChemicalWeaponSignal): Promise<string> => {
    try {
        const prompt = `
You are Aegis, a chemical warfare AI response coordinator.
For a **${alert.status}** signal of **${alert.agent}** detected at **${alert.concentration} ppb** via **${alert.sourceType}** in **${alert.location}**, generate a 3-tier strategic action plan in Markdown format for emergency services.

- A main heading: '### Chemical Threat Response Plan: ${alert.agent}'
- **1. Immediate Public Safety & Evacuation**: Actions for police and fire departments (e.g., define and enforce evacuation zones based on wind models, establish traffic control points, issue emergency alerts via all channels).
- **2. Medical Triage & Treatment**: Actions for hospitals and paramedics (e.g., prepare and distribute specific antidotes like atropine or pralidoxime, set up mass casualty decontamination corridors, brief ER staff on expected symptoms).
- **3. Environmental Remediation & Monitoring**: Actions for environmental agencies (e.g., deploy mobile chemical analysis units to monitor plume dissipation, begin planning for long-term soil/water cleanup).
`;
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating chemical weapon action plan for ${alert.agent}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI chemical threat response service is currently unavailable.");
    }
};

export const getLivestockActionPlan = async (alert: LivestockAlert): Promise<string> => {
    try {
        const prompt = `
You are Aegis, an AI specializing in agricultural biosecurity and veterinary epidemiology.
For a confirmed **${alert.disease}** alert in **${alert.species}**, generate a 3-tier strategic action plan in Markdown format. The plan must be actionable for government officials and stakeholders. The current economic impact is assessed as **'${alert.economicImpact}'**.

- A main heading: '### Strategic Action Plan: ${alert.disease} in ${alert.species}'
- **1. Veterinary & Containment Response**: Detail immediate actions for veterinary departments (e.g., establish quarantine zones, initiate culling protocols for affected herds/flocks, implement ring vaccination/prophylaxis, enhance local surveillance).
- **2. Economic & Trade Impact Mitigation**: Provide recommendations for the Department of Agriculture (e.g., temporary market closures, alternative supply chain logistics, communication protocols for international trade partners to prevent wider bans).
- **3. Public Health Interface**: If the disease has known zoonotic potential (e.g., Avian Influenza), specify actions for public health departments (e.g., issue advisories to farm workers, enhance surveillance for related human symptoms, ensure PPE availability). If not, state "Low direct public health risk, focus on economic and animal welfare."
`;
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating livestock action plan for ${alert.disease}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI livestock action plan service is currently unavailable.");
    }
};

export const getBulkBiosecurityAnalysisAndPlan = async (
  components: NationalBiosecurityIndexData['breakdown']
): Promise<Record<keyof NationalBiosecurityIndexData['breakdown'], { summary: string; plan: string }>> => {
  const componentKeys = Object.keys(components) as Array<keyof typeof components>;

  try {
    const prompts = componentKeys
      .map(key => `- For "${key}", use this context: "${components[key].contextPrompt}"`)
      .join('\n');

    const prompt = `You are Aegis, a national security AI analyst and strategist.
For each of the following biosecurity components, provide two things:
1. A 'summary': A concise, one-paragraph strategic assessment based on its context.
2. A 'plan': A 3-point list of immediate, actionable "ready-to-go" measures for national security officials, formatted as a Markdown bulleted list under a '### Recommended Actions' heading.

Return a single, valid JSON object. The keys of this object must be the exact component keys ("intel", "labReadiness", "countermeasures", "populationVulnerability").
The value for each key must be another JSON object with two properties: "summary" (a string) and "plan" (a string). Ensure the final output is a well-formed JSON object with all strings properly escaped.

Components to analyze:
${prompts}
`;

    const schemaProperties = componentKeys.reduce((acc, key) => {
      acc[key] = {
        type: Type.OBJECT,
        description: `Analysis and action plan for the ${key} component.`,
        properties: {
          summary: {
            type: Type.STRING,
            description: `A one-paragraph strategic assessment for ${key}.`
          },
          plan: {
            type: Type.STRING,
            description: `A 3-point markdown action plan for ${key}.`
          }
        },
        required: ['summary', 'plan'],
      };
      return acc;
    }, {} as Record<string, any>);

    const response = await withRetry<GenerateContentResponse>(() => {
      const ai = getAiClient();
      return ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: schemaProperties,
          },
        },
      });
    });

    let jsonStr = response.text.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
    }
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Error generating bulk biosecurity analysis and plan:", error);
    const errorResult = {} as any;
    const errorMessage = error instanceof Error ? "AI analysis is currently unavailable. Please try again later." : "An unknown error occurred.";
    componentKeys.forEach(key => {
      errorResult[key] = { summary: errorMessage, plan: "" };
    });
    // This re-throws the error to be caught by the component
    throw new Error("Failed to fetch bulk AI analysis for biosecurity panel.");
  }
};

export const getSlaughterhouseActionPlan = async (alert: SlaughterhouseData): Promise<string> => {
    try {
        const prompt = `
You are Aegis, an AI public health strategist specializing in food safety and zoonotic disease.
For a high-risk slaughterhouse/market alert: **${alert.location}**, generate a 3-tier strategic action plan in Markdown format. The plan must be actionable for government officials.

**Facility Data:**
- **Hygiene Score:** ${alert.hygieneScore}/100 (Lower is worse)
- **Detected Pathogens:** ${alert.pathogensDetected.join(', ')}
- **Overall Risk Level:** ${alert.riskLevel}

**Action Plan Structure:**
- A main heading: '### Mitigation Action Plan: ${alert.location}'
- **1. Immediate Public Health Directives**: Actions for local health departments (e.g., issue public advisories, trace products, initiate syndromic surveillance in nearby communities).
- **2. Regulatory & On-Site Actions**: Actions for food safety and veterinary authorities (e.g., temporary suspension of operations, mandatory deep cleaning protocols, re-training of staff, increased testing frequency).
- **3. Worker Safety & Health**: Actions to protect workers (e.g., mandatory PPE, health screenings for workers, vaccination drives if applicable).
`;
        const response = await withRetry<GenerateContentResponse>(() => {
            const ai = getAiClient();
            return ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        });

        return response.text;
    } catch (error) {
        console.error(`Error generating slaughterhouse action plan for ${alert.location}:`, error);
        if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('rate limit'))) {
          throw new Error("The AI service is currently experiencing high traffic. Please try again in a moment.");
        }
        throw new Error("The AI slaughterhouse action plan service is currently unavailable.");
    }
};