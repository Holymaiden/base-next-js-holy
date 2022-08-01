import "../styles/globals.css";

import PropTypes from "prop-types";
import cookie from "cookie";
// ? next
import Head from "next/head";
import App from "next/app";
// ? @mui
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// utils
import { getSettings } from "../src/utils/settings";
// ? contexts
import { SettingsProvider } from "../src/contexts/SettingsContext";
import { CollapseDrawerProvider } from "../src/contexts/CollapseDrawerContext";
// ? components
import NotistackProvider from "../src/components/NotistackProvider";
import ThemeColorPresets from "../src/components/ThemeColorPresets";
import MotionLazyContainer from "../src/components/animate/MotionLazyContainer";
// ? theme
import ThemeProvider from "../src/theme";

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  settings: PropTypes.object,
};

export default function MyApp(props) {
  const { Component, pageProps, settings } = props;

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
      <CollapseDrawerProvider>
        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <NotistackProvider>
              <MotionLazyContainer>
                <ThemeColorPresets>
                  {getLayout(<Component {...pageProps} />)}
                </ThemeColorPresets>
              </MotionLazyContainer>
            </NotistackProvider>
          </ThemeProvider>
        </SettingsProvider>
      </CollapseDrawerProvider>
      {/* </LocalizationProvider> */}
    </>
  );
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context);

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || "" : document.cookie
  );

  const settings = getSettings(cookies);

  return {
    ...appProps,
    settings,
  };
};
