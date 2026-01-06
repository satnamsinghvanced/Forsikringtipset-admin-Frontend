import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import homePageReducer from "./slices/homepageSlice";
import articleReducer from "./slices/articleSlice";
import categoriesSlice from "./slices/articleCategoriesSlice";
import aboutReducer from "./slices/aboutPageSlice";
import faqReducer from "./slices/faq";
import categoryReducer from "./slices/category";
import partnerReducer from "./slices/partnerSlice";
import formReducer from "./slices/formSlice";
import privacyPolicyReducer from "./slices/privacyPolicySlice";
import termOfServiceReducer from "./slices/termOfService";
import countySlice from "./slices/countySlice";
import companySlice from "./slices/companySlice";
import themeReducer from "./slices/themeSlice";
import placeSlice from "./slices/placeSlice";
import QuoteReducer from "./slices/quoteSlice";
import realEstateAgentSlice from "./slices/realEstateAgents";
import collaboratePartners from "./slices/partnersSlice";
import website_settings from "./slices/website_settingsSlice";
import footerReducer from "./slices/footerSlice";
import sitemapSlice from "./slices/sitemapSlice";
import contactSlice from "./slices/contactUsSlice";
import smtpSlice from "./slices/smtpSlice";
import LeadLogsSlice from "./slices/leadLogsSlice";
import leadTypeSlice from "./slices/leadTypeSlice";
import faqSlice from "./slices/FaqPageSlice";
import articleSlice from "./slices/articlePageSlice";
import formPageSlice from "./slices/formPageSlice";
import formSelectSlice from "./slices/formSelectSlice";
import stepReducer from "./slices/stepSlice";
export default configureStore({
  reducer: {
    user,
    homepage: homePageReducer,
    articles: articleReducer,
    categories: categoriesSlice,
    about: aboutReducer,
    faq: faqReducer,
    category: categoryReducer,
    partner: partnerReducer,
    form: formReducer,
    privacyPolicy: privacyPolicyReducer,
    termOfService: termOfServiceReducer,
    counties: countySlice,
    companies: companySlice,
    places: placeSlice,
    theme: themeReducer,
    quote: QuoteReducer,
    agents: realEstateAgentSlice,
    settings: website_settings,
    partners: collaboratePartners,
    footer: footerReducer,
    sitemap: sitemapSlice,
    contact: contactSlice,
    smtp: smtpSlice,
    lead: LeadLogsSlice,
    leadType: leadTypeSlice,
    faqPage: faqSlice,
    articlePage: articleSlice,
    formPage: formPageSlice,
    formSelect: formSelectSlice,
    steps: stepReducer,
  },
});
