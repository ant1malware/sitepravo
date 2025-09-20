export const ASCII_USERNAME = /^[A-Za-z0-9_]{3,16}$/; // 3-16: латиница/цифры/_

export function assertAsciiUsername(name: string) {
  if (!ASCII_USERNAME.test(name)) {
    throw new Error("Ник должен быть на английском: 3–16 символов (латиница, цифры, _).");
  }
}
