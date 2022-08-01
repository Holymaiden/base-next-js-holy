import "../styles/globals.css";
// scroll bar
import "simplebar/src/simplebar.css";

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
import Settings from "../src/components/settings";
import RtlLayout from "../src/components/RtlLayout";
import ProgressBar from "../src/components/ProgressBar";
import NotistackProvider from "../src/components/NotistackProvider";
import ThemeColorPresets from "../src/components/ThemeColorPresets";
import MotionLazyContainer from "../src/components/animate/MotionLazyContainer";
// ? theme
import ThemeProvider from "../src/theme";
// ? Auth
import { AuthProvider } from "../src/contexts/JWTContext";

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
      <AuthProvider>
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        <CollapseDrawerProvider>
          <SettingsProvider defaultSettings={settings}>
            <ThemeProvider>
              <NotistackProvider>
                <MotionLazyContainer>
                  <ThemeColorPresets>
                    <RtlLayout>
                      <Settings />
                      <ProgressBar />
                      {getLayout(<Component {...pageProps} />)}
                    </RtlLayout>
                  </ThemeColorPresets>
                </MotionLazyContainer>
              </NotistackProvider>
            </ThemeProvider>
          </SettingsProvider>
        </CollapseDrawerProvider>
        {/* </LocalizationProvider> */}
      </AuthProvider>
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
