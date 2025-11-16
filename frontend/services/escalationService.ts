const API = "https://aegis-biosurveillance.onrender.com/api/escalation";

export async function getActiveEscalation() {
  const res = await fetch(`${API}/active`);
  return res.json();
}

export async function escalate(newAlert: any) {
  const res = await fetch(`${API}/escalate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAlert),
  });
  return res.json();
}

export async function acknowledge(id: string) {
  const res = await fetch(`${API}/acknowledge/${id}`, {
    method: "PUT",
  });
  return res.json();
}

export async function resolveEscalation(id: string) {
  const res = await fetch(`${API}/resolve/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
