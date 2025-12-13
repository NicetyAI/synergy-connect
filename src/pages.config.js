import Home from './pages/Home';
import Partnerships from './pages/Partnerships';
import Opportunities from './pages/Opportunities';
import Recommendations from './pages/Recommendations';
import Vendors from './pages/Vendors';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Partnerships": Partnerships,
    "Opportunities": Opportunities,
    "Recommendations": Recommendations,
    "Vendors": Vendors,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};