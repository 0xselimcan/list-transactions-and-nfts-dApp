import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import ProfileLayout from "./components/ProfileLayout";
import NotFoundPage from "./pages/NotFoundPage";
import SelectAddressPage from "./pages/SelectAddressPage";
import ShowNftsPage from "./pages/ShowNftsPage";
import ShowTransactionsPage from "./pages/ShowTransactionsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="profile/:address" element={<ProfileLayout />}>
          <Route path="tx" element={<ShowTransactionsPage />} />
          <Route path="nft" element={<ShowNftsPage />} />
          <Route index element={<Navigate to={"tx"} />} />
        </Route>
        <Route index element={<SelectAddressPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
