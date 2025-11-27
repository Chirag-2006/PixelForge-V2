export function generateUsername(firstName = "user") {
  const clean = firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${clean}_${random}`;
}
