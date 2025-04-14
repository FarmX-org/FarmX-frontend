export const apiRequest = async (
  endPoint: string,
  method = "GET",
  body: unknown = null
) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endPoint}`;

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must log in first.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text(); // ← نقرأ الرد كنص

    if (!response.ok) {
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Request failed");
      } catch {
        // الرد مو JSON
        throw new Error(text);
      }
    }

    try {
      return JSON.parse(text); // نحاول نحوله JSON لو نجح
    } catch {
      // مو JSON؟ نرجعه كـ raw نص
      return text;
    }

  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
