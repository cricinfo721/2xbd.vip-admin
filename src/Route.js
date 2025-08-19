import ActiveMatch from "./pages/ActiveMatch";
import AddMatch from "./pages/AddMatch";
import AprofitCasino from "./pages/AprofitCasino";
import AprofitDownline from "./pages/AprofitDownline";
import AprofitByDownline from "./pages/AprofitByDownline";
import AprofitMarket from "./pages/AprofitMarket";
import Adownlinesportspl from "./pages/Adownlinesportspl";
import ACdownlinesportspl from "./pages/ACdownlinesportspl";
import ACasinoprofitAndLossDownlineNew from "./pages/ACasinoprofitAndLossDownlineNew";
import ICasinoprofitAndLossDownlineNew from "./pages/ICasinoprofitAndLossDownlineNew";
import Banking from "./pages/Banking/Banking";
import BetCount from "./pages/BetCount";
import BetList from "./pages/BetList";
import BetListLive from "./pages/BetListLive";
import UserBetListLive from "./pages/UserBetListLive/UserBetListLive";
import BettingHistory from "./pages/BettingHistory/BettingHistory";
import BettingProfitLoss from "./pages/BettingProfitLoss/BettingProfitLoss";
import BlockMarket from "./pages/BlockMarket";
import DefaultSetting from "./pages/DefaultSetting";
import FancyResult from "./pages/FancyResult";
import GeneralSetting from "./pages/Generalsetting";
import Home from "./pages/Home";
import HyperMessage from "./pages/HyperMessage";
import ImportantMessage from "./pages/ImportantMessage";
import InActiveMatch from "./pages/InActiveMatch";
import InactiveUsers from "./pages/InactiveUsers";
import LiveMatchBet from "./pages/LiveMatchBet";
import ManageLinks from "./pages/ManageLinks";
import Manupulation from "./pages/Manupulation";
import MarketResult from "./pages/MarketResult";
import TossResult from "./pages/TossResult";
import MyAccountStatement from "./pages/MyAccount/MyAccountStatement";
import MyAccountSummary from "./pages/MyAccount/MyAccountSummary";
import MyActivityLog from "./pages/MyAccount/MyActivityLog";
import MyProfile from "./pages/MyAccount/MyProfile";
import TransactionLogs from "./pages/MyAccount/TransactionLogs";
import PlayerBalance from "./pages/PlayerBalance";
import PreMatch from "./pages/PreMatch";
import RejectedBets from "./pages/RejectedBets/RejectedBets";
import ViewFancyDetails from "./pages/RejectedBets/ViewFancyDetails";
import Result from "./pages/Result";
import RiskManagement from "./pages/RiskManagement/RiskManagement";
import SearchMatch from "./pages/SearchMatch";
import SearchUser from "./pages/SearchUser";
import SetBookMarker from "./pages/SetBookMarker";
import SetLimit from "./pages/SetLimit";
import SportSetting from "./pages/SportSetting";
import StatementByUser from "./pages/StatementByUser";
import SurveillanceSetting from "./pages/SurveillanceSetting";
import SuspendedResult from "./pages/SuspendedResult";
import UserMessage from "./pages/UserMessage";
import AccountSummary from "./pages/Users/AccountSummary";
import ActivityLog from "./pages/Users/ActivityLog";
import TransactionHistory from "./pages/Users/TransactionHistory";
import TransactionHistory2 from "./pages/Users/TransactionHistory2";
import ViewCasinoBetDialog from "./pages/InternationalCasionBets";
import ViewAECasionBets from "./pages/AECasionBets";
import WebsiteSetting from "./pages/WebsiteSetting";
import BetLockUser from "./pages/BetLockUser";
import Statements from "./pages/Statements";
import SuspendedMarketResult from "./pages/SuspendedMarketResult";
import SuspendedFancyResult from "./pages/SuspendedFancyResult";
import viewBets from "./pages/viewBets";
import updateFancyStatus from "./pages/updateFancyStatus";
import UserProfitLoss from "./pages/UserProfitLoss";
import MatchProfitLoss from "./pages/MatchProfitLoss";
import ShowBetsCR from "./pages/ShowBetsCR";
import DisplayMatchBet from "./pages/DisplayMatchBet";
import DisplaySessionBet from "./pages/DisplaySessionBet";
import AddWebsite from "./pages/AddWebsite";
import CurrentBets from "./pages/CurrentBets";
import DefaultAgent from "./pages/DefaultAgent";
import WalletWithdrwal from "./pages/WalletWithdrwal";
import WalletDeposit from "./pages/WalletDeposit";
import Dashboard from "./pages/Dashboard";
import Banks from "./pages/Banking/Banks";
import DepositHistory from "./pages/DepositHistory";
import WithdrawalHistory from "./pages/WithdrawalHistory";
import BannerList from "./pages/Banner/List";
import ComissionReport from "./pages/ComissionReport";
import PromotionalOffer from "./pages/PromotionalOffer";
import CSetting from "./pages/CSetting";
import Sms from "./pages/Sms";
import NagadSms from "./pages/NagadSms";
import WithdrwaRequest from "./pages/WithdrawRequest";
import AgentWithdrawHistory from "./pages/AgentWithdrawHistory";
import AgentRefrralList from "./pages/AgentRefrralList";
import AffilateList from "./pages/Users/AffilateList";
import MatchedAll from "./pages/RiskManagement/MatchedAll";
import ChatSupport from "./pages/MyAccount/ChatSupport";

import AffiliateKyc from "./pages/AffiliateKyc";
import AffiliateKycList from "./pages/AffiliateKycList";
import Turnover from "./pages/Users/Turnover";

export const routes = [
  {
    path: "/",
    Component: Home,
    permission: [],
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    permission: [],
  },
  {
    path: "/:id/:user_type",
    Component: Home,
    permission: [],
  },
  {
    path: "/account-summary",
    Component: AccountSummary,
    permission: [],
  },
  {
    path: "/betting-history",
    Component: BettingHistory,
    permission: [],
  },
  {
    path: "/sms",
    Component: Sms,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/nagad-sms",
    Component: NagadSms,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/TransactionHistory",
    Component: TransactionHistory,
    permission: [],
  },
  {
    path: "/activitylog",
    Component: ActivityLog,
    permission: [],
  },
  {
    path: "/betting-profit-loss",
    Component: BettingProfitLoss,
    permission: [],
  },
  {
    path: "/account-summary/:id/:type/:page",
    Component: AccountSummary,
    permission: [],
  },
  {
    path: "/account-summary/:id/:type",
    Component: AccountSummary,
    permission: [],
  },
  {
    path: "/betting-history/:id/:type",
    Component: BettingHistory,
    permission: [],
  },
  {
    path: "/current-bets",
    Component: UserBetListLive,
    permission: [],
  },
  {
    path: "/current-bets/:id/:type",
    Component: UserBetListLive,
    permission: [],
  },

  {
    path: "/transaction-history/:id",
    Component: TransactionHistory,
    permission: [],
  },
  {
    path: "/transaction-history/:id/:type",
    Component: TransactionHistory,
    permission: [],
  },
  {
    path: "/currentBets/:id/:type",
    Component: CurrentBets,
    permission: [],
  },
  {
    path: "/banks",
    Component: Banks,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/transaction-history/:id/:type",
    Component: TransactionHistory,
    permission: [],
  },
  {
    path: "/transaction-history-2/:id/:type",
    Component: TransactionHistory2,
    permission: [],
  },
  {
    path: "/transaction-history-2/:id",
    Component: TransactionHistory2,
    permission: [],
  },
  {
    path: "/matchedAll",
    Component: MatchedAll,
    permission: [],
  },
  {
    path: "/AECasionBets/:id/:type",
    Component: ViewAECasionBets,
    permission: [],
  },
  {
    path: "/InternationalCasionBets/:id/:type",
    Component: ViewCasinoBetDialog,
    permission: [],
  },
  {
    path: "/activity-log/:id",
    Component: ActivityLog,
    permission: [],
  },
  {
    path: "/activity-log/:id/:type",
    Component: ActivityLog,
    permission: [],
  },
  {
    path: "/betting-profit-loss/:id/:type",
    Component: BettingProfitLoss,
    permission: [],
  },

  {
    path: "/my-account-summary",
    Component: MyAccountSummary,
    permission: [],
  },
  {
    path: "/my-account-statement",
    Component: MyAccountStatement,
    permission: [],
  },
  {
    path: "/my-profile",
    Component: MyProfile,
    permission: [],
  },
  {
    path: "/deposit-history",
    Component: DepositHistory,
    permission: [],
  },
  {
    path: "/withdrawal-history",
    Component: WithdrawalHistory,
    permission: [],
  },
  {
    path: "/agent-withdraw-history",
    Component: AgentWithdrawHistory,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/my-activity-log",
    Component: MyActivityLog,
    permission: [],
  },
  {
    path: "/transaction-logs",
    Component: TransactionLogs,
    permission: [],
  },
  {
    path: "/transaction-logs/:id",
    Component: TransactionLogs,
    permission: [],
  },

  {
    path: "/statements/:id",
    Component: Statements,
    permission: [],
  },
  {
    path: "/Betlist",
    Component: BetList,
    permission: [],
  },
  {
    path: "/BetListLive",
    Component: BetListLive,
    permission: [],
  },
  {
    path: "/AprofitDownline",
    Component: AprofitDownline,
    permission: ["owner", "sub_owner"],
  },

  {
    path: "/AprofitByDownline",
    Component: AprofitByDownline,
    permission: ["owner", "sub_owner"],
  },

  {
    path: "/AprofitDownline/:id/:user_type",
    Component: AprofitDownline,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/AprofitByDownline/:id/:user_type",
    Component: AprofitByDownline,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/AprofitMarket",
    Component: AprofitMarket,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/AprofitCasino",
    Component: AprofitCasino,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/Adownlinesportspl",
    Component: Adownlinesportspl,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/ACdownlinesportspl",
    Component: ACdownlinesportspl,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/ACdownlinesportspl/:id/:user_type",
    Component: ACdownlinesportspl,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/ACasinoprofitAndLossDownlineNew",
    Component: ACasinoprofitAndLossDownlineNew,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/ACasinoprofitAndLossDownlineNew/:id/:user_type",
    Component: ACasinoprofitAndLossDownlineNew,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/ICasinoprofitAndLossDownlineNew",
    Component: ICasinoprofitAndLossDownlineNew,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/ICasinoprofitAndLossDownlineNew/:id/:user_type",
    Component: ICasinoprofitAndLossDownlineNew,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/Withdraw_request",
    Component: WithdrwaRequest,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/commission-report",
    Component: ComissionReport,
    permission: [],
  },
  {
    path: "/StatementByUser",
    Component: StatementByUser,
    permission: [],
  },
  {
    path: "/RiskManagement",
    Component: RiskManagement,
    permission: [],
  },
  // {
  //   path: "/banking",
  //   Component: Banking,
  //   permission: ["owner", "sub_owner"],
  // },
  {
    path: "/SetBookMarker",
    Component: SetBookMarker,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/agent-referral-list",
    Component: AffilateList,
    permission: ["agent"]
  },
  {
    path: "/block-market",
    Component: BlockMarket,
    permission: ["owner", "sub_owner"], //"owner", "sub_owner"
  },
  {
    path: "/sport-setting",
    Component: SportSetting,
    permission: ["owner"],
  },
  {
    path: "/SetLimit/:id/:type",
    Component: SetLimit,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/Manupulation",
    Component: Manupulation,
    permission: ["owner", "sub_owner"],
  },

  {
    path: "/wallet-withdrawal",
    Component: WalletWithdrwal,
    permission: ["owner", "sub_owner", "agent", "super_agent"],
  },
  {
    path: "/wallet-deposit",
    Component: WalletDeposit,
    permission: ["owner", "sub_owner", "agent", "super_agent"],
  },
  {
    path: "/add-match",
    Component: AddMatch,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/general-setting",
    Component: GeneralSetting,
    permission: [], //"owner", /defaultsetting"sub_owner"
  },
  {
    path: "/manage-links",
    Component: ManageLinks,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/add-website",
    Component: AddWebsite,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/FancyResult",
    Component: FancyResult,
    permission: [],
  },
  {
    path: "/MarketResult",
    Component: MarketResult,
    permission: [],
  },
  {
    path: "/TossResult",
    Component: TossResult,
    permission: [],
  },
  {
    path: "/banner-list",
    Component: BannerList,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/LiveMatchBet",
    Component: LiveMatchBet,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/defaultAgent",
    Component: DefaultAgent,
    permission: ["sub_owner"],
  },
  {
    path: "/promotionalOffer",
    Component: PromotionalOffer,
    permission: ["sub_owner"],
  },
  {
    path:"/commission-report",
    Component: ComissionReport,
    permission: ["agent"],
  },
  {
    path: "/BetCount",
    Component: BetCount,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/PreMatch",
    Component: PreMatch,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/MatchProfitLoss/:id",
    Component: MatchProfitLoss,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/ShowBetsCR/:eventId/:userId",
    Component: ShowBetsCR,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/DisplayMatchBet/:eventId",
    Component: DisplayMatchBet,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/DisplaySessionBet/:eventId",
    Component: DisplaySessionBet,
    permission: ["owner", "sub_owner"],
  },

  {
    path: "/SearchMatch",
    Component: SearchMatch,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/PlayerBalance",
    Component: PlayerBalance,
    permission: [], //"owner", "sub_owner"
  },

  {
    path: "/UserProfitLoss",
    Component: UserProfitLoss,
    permission: ["owner", "sub_owner"],
  },

  {
    path: "/result",
    Component: Result,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/WebsiteSetting",
    Component: WebsiteSetting,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/rejected-bets",
    Component: RejectedBets,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/fancy-details/:id",
    Component: ViewFancyDetails,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/searchuser",
    Component: SearchUser,
    permission: ["owner", "sub_owner"], //"owner", "sub_owner"
  },
  {
    path: "/defaultsetting",
    Component: DefaultSetting,
    permission: ["owner", "sub_owner"],
  },
  {
    path: "/SurveillanceSetting",
    Component: SurveillanceSetting,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/active-match",
    Component: ActiveMatch,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/in-active-match",
    Component: InActiveMatch,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/SuspendedResult",
    Component: SuspendedResult,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/user-message",
    Component: UserMessage,
    permission: ["owner", "sub_owner", "agent"],
  },
  {
    path: "/hyper-message",
    Component: HyperMessage,
    permission: ["owner"],
  },
  {
    path: "/importantmessage",
    Component: ImportantMessage,
    permission: ["owner"],
  },
  {
    path: "/inactive-users",
    Component: InactiveUsers,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/BetLockUser",
    Component: BetLockUser,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/SuspendedMarketResult",
    Component: SuspendedMarketResult,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/SuspendedFancyResult",
    Component: SuspendedFancyResult,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/viewBets/:eventId",
    Component: viewBets,
    permission: [], //"owner", "sub_owner"
  },
  {
    path: "/updateFancyStatus",
    Component: updateFancyStatus,
    permission: [], //"owner", "sub_owner"
  },
  {
    path:"/Commission_setting",
    Component: CSetting,
    permission: [],
  },
  {
    path:"/chat-support",
    Component: ChatSupport,
    permission: [],
  },
  {
    path: "/affiliate-kyc",
    Component:  AffiliateKyc,
    permission: [],
    
  },
  {
    path: "/affiliate-kyc-list",
    Component:  AffiliateKycList,
    permission: ["owner", "sub_owner"],
    
  },
  {
    path: "/turnover/:id/:type",
    Component: Turnover,
    permission: [],
  },
];
