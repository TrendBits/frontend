// Simple cookie utilities
export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value};path=/;SameSite=Strict;Secure;max-age=604800`;
};

export const getCookie = (name: string) => {
  return (
    document.cookie
      .split(";")
      .find((row) => row.trim().startsWith(name + "="))
      ?.split("=")[1] || null
  );
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;path=/;max-age=0`;
};
