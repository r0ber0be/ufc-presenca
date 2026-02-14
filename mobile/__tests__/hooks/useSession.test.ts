import { getToken, removeToken } from "@/hooks/useAuthToken";
import { getValidSessionToken } from "@/hooks/useSession";
import { removeStudentData } from "@/hooks/useStudentData";
import { jwtDecode } from "jwt-decode";

jest.mock("@/hooks/useAuthToken", () => ({
  getToken: jest.fn(),
  removeToken: jest.fn(),
}));

jest.mock("@/hooks/useStudentData", () => ({
  removeStudentData: jest.fn(),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

describe("getValidSessionToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns token when token is valid and not expired", async () => {
    (getToken as jest.Mock).mockResolvedValue("valid-token");
    (jwtDecode as jest.Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    const result = await getValidSessionToken();

    expect(result).toBe("valid-token");
    expect(removeToken).not.toHaveBeenCalled();
    expect(removeStudentData).not.toHaveBeenCalled();
  });

  it("clears session when token is expired", async () => {
    (getToken as jest.Mock).mockResolvedValue("expired-token");
    (jwtDecode as jest.Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 60,
    });

    const result = await getValidSessionToken();

    expect(result).toBeNull();
    expect(removeToken).toHaveBeenCalledTimes(1);
    expect(removeStudentData).toHaveBeenCalledTimes(1);
  });

  it("clears session when token is invalid", async () => {
    (getToken as jest.Mock).mockResolvedValue("invalid-token");
    (jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error("invalid token");
    });

    const result = await getValidSessionToken();

    expect(result).toBeNull();
    expect(removeToken).toHaveBeenCalledTimes(1);
    expect(removeStudentData).toHaveBeenCalledTimes(1);
  });
});
