import { GoogleAnalytics, TelemetryProvider } from "./providers/telemetry";
import { CookiesProvider } from "./providers/cookies";
import { StateProvider } from "./providers/state";
import { RouterProvider } from "./providers/router";
import { CacheProvider } from "./providers/cache";
import { ThemeProvider } from "./providers/theme";

import { TELEMETRY_DEBOUNCE } from "../const";
import Root from "./pages";

function App() {
	return (
		<ThemeProvider supportsDarkMode={true}>
			<CookiesProvider>
				<TelemetryProvider
					Provider={GoogleAnalytics}
					debounce={TELEMETRY_DEBOUNCE}
				>
					<StateProvider>
						<RouterProvider>
							<CacheProvider>
								<Root />
							</CacheProvider>
						</RouterProvider>
					</StateProvider>
				</TelemetryProvider>
			</CookiesProvider>
		</ThemeProvider>
	);
}

export default App;
