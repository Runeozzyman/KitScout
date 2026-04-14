//external API used for CAD to USD conversion

export async function getRate(from: string): Promise<number> {
  if (from === "CAD") return 1;

  const res = await fetch(
    `https://api.frankfurter.app/latest?from=${from}&to=CAD`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch current rate: ${res.status}`);
  }

  const data = await res.json();
  return data.rates["CAD"];
}