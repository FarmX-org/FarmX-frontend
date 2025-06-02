export const getTokenExpiration = (token: string): number | null => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.exp * 1000; 
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
};
