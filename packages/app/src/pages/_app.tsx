import "../bootstrap";
import "../styles/index.css";

import { Fragment, FunctionComponent } from "react";
import { GetStaticProps, NextComponentType, NextPageContext } from "next";
import store, { persistor } from "../state";

import type { AppProps } from "next/app";
import ApplicationUpdater from "../state/application/updater";
import DefaultLayout from "../layouts/Default";
import Dots from "../components/Dots";
import Head from "next/head";
import { I18nProvider } from "@lingui/react";
import ListsUpdater from "../state/lists/updater";
import MulticallUpdater from "../state/multicall/updater";
import { PersistGate } from "redux-persist/integration/react";
import ReactGA from "react-ga";
import { Provider as ReduxProvider } from "react-redux";
import TransactionUpdater from "../state/transactions/updater";
import UserUpdater from "../state/user/updater";
import Web3ReactManager from "../components/Web3ReactManager";
import { Web3ReactProvider } from "@web3-react/core";
import dynamic from "next/dynamic";
import getLibrary from "../functions/getLibrary";
import { i18n } from "@lingui/core";
import { nanoid } from "@reduxjs/toolkit";
import { remoteLoader } from "@lingui/remote-loader";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { useActiveWeb3React } from "../hooks";
import { SubgraphProvider } from "../providers/SubgraphProvider";
import { initTranslation, loadTranslation } from "../entities";

const client = new ApolloClient({
  uri: "http://127.0.0.1:8000/subgraphs/name/luxdefi/luxtown",
  cache: new InMemoryCache(),
});

const Web3ProviderNetwork = dynamic(
  () => import("../components/Web3ProviderNetwork"),
  { ssr: false }
);

// const Web3ReactManager = dynamic(() => import('../components/Web3ReactManager'), { ssr: false })

if (typeof window !== "undefined" && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}
initTranslation(i18n);
function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Guard: FunctionComponent;
    Layout: FunctionComponent;
    Provider: FunctionComponent;
  };
}) {
  const { pathname, query, locale } = useRouter();

  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      testMode: process.env.NODE_ENV === "development",
    });

    const errorHandler = (error) => {
      ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true,
      });
    };

    window.addEventListener("error", errorHandler);

    return () => window.removeEventListener("error", errorHandler);
  }, []);

  useEffect(() => {
    ReactGA.pageview(`${pathname}${query}`);
  }, [pathname, query]);

  useEffect(() => {
    if (pageProps.messages) {
      console.log("pageProps.messages", pageProps.messages);
      i18n.load(locale, pageProps.messages);
      i18n.activate(locale);
    }
  }, [locale, pageProps.messages]);

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment;

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout;

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment;

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title key="title">LUX</title>

        <meta
          key="description"
          name="description"
          content="The future is decentralized."
        />

        <meta name="application-name" content="Lux Defi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Lux Defi" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#F338C3" />

        <meta key="twitter:card" name="twitter:card" content="app" />
        <meta key="twitter:title" name="twitter:title" content="Lux Defi" />
        <meta
          key="twitter:url"
          name="twitter:url"
          content="https://lux.financial/"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="The future is decentralized."
        />
        <meta
          key="twitter:image"
          name="twitter:image"
          content="https://lux.financial/lux.png"
        />
        <meta
          key="twitter:creator"
          name="twitter:creator"
          content="@SushiSwap"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:site_name" property="og:site_name" content="Lux Defi" />
        <meta key="og:url" property="og:url" content="https://lux.financial" />
        <meta
          key="og:image"
          property="og:image"
          content="https://lux.financial/lux.png"
        />
        <meta
          key="og:description"
          property="og:description"
          content="The future is decentralized."
        />
      </Head>

      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <SubgraphProvider>
                <ReduxProvider store={store}>
                  <PersistGate
                    loading={<Dots>loading</Dots>}
                    persistor={persistor}
                  >
                    <>
                      <ListsUpdater />
                      <UserUpdater />
                      <ApplicationUpdater />
                      <TransactionUpdater />
                      <MulticallUpdater />
                    </>
                    <Provider>
                      <Layout>
                        <Guard>
                          <Component {...pageProps} />
                        </Guard>
                      </Layout>
                    </Provider>
                  </PersistGate>
                </ReduxProvider>
              </SubgraphProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </I18nProvider>
    </Fragment>
  );
}

export default MyApp;
