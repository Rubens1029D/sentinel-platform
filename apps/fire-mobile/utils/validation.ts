export const NAME_PATTERN = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

export const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export function validateName(value: string): string | undefined {
  const name = value.trim();

  if (!name) {
    return 'El nombre es obligatorio.';
  }

  if (name.length < 2) {
    return 'El nombre debe tener al menos 2 letras.';
  }

  if (!NAME_PATTERN.test(name)) {
    return 'Usa únicamente letras sin acentos y espacios.';
  }

  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();

  if (!email) {
    return 'El correo electrónico es obligatorio.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Ingresa un correo electrónico válido.';
  }

  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return 'La contraseña ligatoria.';
  }

  if (value.length < 6) {
    return 'Debe contener al menos 6 caracteres.';
  }

  if (!/[A-Z]/.test(value)) {
    return 'Debe incluir al menos una letra mayúscula.';
  }

  if (!/[a-z]/.test(value)) {
    return 'Debe incluir al menos una letra minúscula.';
  }

  if (!/\d/.test(value)) {
    return 'Debe incluir al menos un número.';
  }

  if (!PASSWORD_PATTERN.test(value)) {
    return 'La contraseña no cumple los requisitos.';
  }

  return undefined;
}
