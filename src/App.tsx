
import ThemeLoader from "./theme/ThemeLoader";
import DatabaseLoader from "./database/DatabaseLoader";
import GlobalStateLoader from "./globalstate/GlobalStateLoader";
import CookieLoader from "./cookie/CookieLoader";
import QueryParamsLoader from "./queryparams/QueryParamsLoader";
import SelectionLoader from "./selection/SelectionLoader";
import CountsLoader from "./counts/CountsLoader";

import Layout from "./layout/Layout";

import SearchFragment from "./fragment/SearchFragment";
import OverviewFragment from "./fragment/OverviewFragment";
import BooksFragment from "./fragment/BooksFragment";
import AuthorsFragment from "./fragment/AuthorsFragment";
import CategoriesFragment from "./fragment/CategoriesFragment";

import OpeningSharedDialog from "./dialog/OpeningSharedDialog";
import ShareDialog from "./dialog/ShareDialog";
import ExportDialog from "./dialog/ExportDialog";
import ErrorDialog from "./dialog/ErrorDialog";


export default function App() {

    return (
        <ThemeLoader>
            <GlobalStateLoader>
                <CookieLoader>
                    <QueryParamsLoader>
                        <DatabaseLoader>
                            <SelectionLoader>
                                <CountsLoader>
                                    <Layout>
                                        {[
                                            { tag: "overview", label: "Přehled", component: (<OverviewFragment/>) },
                                            { tag: "search", label: "Vyhledat", component: (<SearchFragment/>) },
                                            { tag: "books", label: "Díla", component: (<BooksFragment/>)},
                                            { tag: "authors", label: "Autoři", component: (<AuthorsFragment/>)},
                                            { tag: "categories", label: "Kategorie", component: (<CategoriesFragment/>)},
                                        ]}
                                    </Layout>
                                    <>
                                        <OpeningSharedDialog/>
                                        <ShareDialog/>
                                        <ExportDialog/>
                                        <ErrorDialog/>
                                    </>
                                </CountsLoader>
                            </SelectionLoader>
                        </DatabaseLoader>
                    </QueryParamsLoader>
                </CookieLoader>
            </GlobalStateLoader>
        </ThemeLoader>
    );
}