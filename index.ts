import { useOkto, OktoContextType } from "okto-sdk-react";
import { useRouter } from "next/navigation";

export const isLoggedIn = (): boolean => {
  const { isLoggedIn } = useOkto() as OktoContextType;
  return isLoggedIn;
};

export const authenticate = async (idToken: string): Promise<any> => {
  const { authenticate } = useOkto() as OktoContextType;
  return new Promise((resolve, reject) => {
    authenticate(idToken, (result, error) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

export const useLogout = (): (() => Promise<void>) => {
  const { logOut } = useOkto() as OktoContextType;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut(); 
      console.log("User logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return handleLogout;
};

export const getPortfolio = async (): Promise<any> => {
  const { getPortfolio } = useOkto() as OktoContextType;
  return await getPortfolio();
}

export const transferTokens = async (transferData: any): Promise<any> => {
  const { transferTokens } = useOkto() as OktoContextType;
  return await transferTokens(transferData);
};

export const useGetWallets = async (): Promise<any> => {
  const { getWallets } = useOkto() as OktoContextType;
  return await getWallets();
};

export const createWallet = async (walletData: any): Promise<any> => {
  const { createWallet } = useOkto() as OktoContextType;
  return await createWallet();
};

export const getSupportedNetworks = async (): Promise<any> => {
  const { getSupportedNetworks } = useOkto() as OktoContextType;
  return await getSupportedNetworks();
};

export const getSupportedTokens = async (): Promise<any> => {
  const { getSupportedTokens } = useOkto() as OktoContextType;
  return await getSupportedTokens();
};

export const getUserDetails = async (): Promise<any> => {
  const { getUserDetails } = useOkto() as OktoContextType;
  return await getUserDetails();
};

export const orderHistory = async (filters: any): Promise<any> => {
  const { orderHistory } = useOkto() as OktoContextType;
  return await orderHistory(filters);
};

export const getNftOrderDetails = async (orderData: any): Promise<any> => {
  const { getNftOrderDetails } = useOkto() as OktoContextType;
  return await getNftOrderDetails(orderData);
};

export const showWidgetModal = (): void => {
  const { showWidgetModal } = useOkto() as OktoContextType;
  showWidgetModal();
};

export const executeRawTransaction = async (transactionData: any): Promise<any> => {
  const { executeRawTransaction } = useOkto() as OktoContextType;
  return await executeRawTransaction(transactionData);
};

