import { Fragment } from "react"
import { Outlet, ScrollRestoration } from "react-router-dom"
import { UnifiedWalletButtonProps, UnifiedWalletProviderProps } from "@solana-wallets/unified"
import { WalletProvider } from "@solana-wallets/react-2.0"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "unified-wallet-modal": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > &
        UnifiedWalletProviderProps
    }
    interface IntrinsicElements {
      "unified-wallet-modal-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > &
        UnifiedWalletButtonProps
    }
  }
}

export default function App() {
  return (
    <Fragment>
      <WalletProvider
        autoConnect={true}
        disconnectOnAccountChange={true}
        env="mainnet-beta"
        localStorageKey="unified:wallet-storage-key"
      >
        <Fragment>
          <unified-wallet-modal
          // config={{
          //   env: "mainnet-beta",
          //   theme: "jupiter",
          //   metadata: {
          //     name: "UnifiedWallet69",
          //     description: "UnifiedWallet69",
          //     url: "https://jup.ag69",
          //     iconUrls: ["https://jup.ag/favicon.ico/69"],
          //   },
          //   walletlistExplanation: {
          //     href: "https://station.jup.ag/docs/additional-topics/wallet-list",
          //   },
          // }}
          />
          <Outlet />
          <ScrollRestoration />
        </Fragment>
      </WalletProvider>
    </Fragment>
  )
}
