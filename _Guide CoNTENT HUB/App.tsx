import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GuidesHub from "./pages/GuidesHub";
import GuidePage from "./pages/GuidePage";
import WhatToDoAfterCarAccident from "./pages/WhatToDoAfterCarAccident";
import DoINeedALawyer from "./pages/DoINeedALawyer";
import CarAccidentGuide from './pages/CarAccidentGuide';
import SlipAndFallGuide from './pages/SlipAndFallGuide';
import TruckAccidentGuide from './pages/TruckAccidentGuide';
import MedicalMalpracticeGuide from './pages/MedicalMalpracticeGuide';
import WorkplaceInjuryGuide from './pages/WorkplaceInjuryGuide';
import MotorcycleAccidentGuide from './pages/MotorcycleAccidentGuide';
import PedestrianAccidentGuide from './pages/PedestrianAccidentGuide';
import DogBiteGuide from './pages/DogBiteGuide';
import WrongfulDeathGuide from './pages/WrongfulDeathGuide';
import RideshareAccidentGuide from './pages/RideshareAccidentGuide';
import InsuranceClaimGuide from './pages/InsuranceClaimGuide';
import CaseReviewPage from '@/pages/CaseReviewPage';
import TruckAccidentWhatToDo from '@/pages/TruckAccidentWhatToDo';
import StateSpecificLanding from './pages/StateSpecificLanding';
import CarAccidentRearEnd from '@/pages/CarAccidentRearEnd';
import CarAccidentTBone from '@/pages/CarAccidentTBone';
import CarAccidentHitAndRun from '@/pages/CarAccidentHitAndRun';
import CarAccidentIntersection from '@/pages/CarAccidentIntersection';
import CarAccidentParkingLot from '@/pages/CarAccidentParkingLot';
import CarAccidentMultiVehicle from '@/pages/CarAccidentMultiVehicle';
import CarAccidentCategoryGuide from '@/pages/CarAccidentCategoryGuide';
import TruckAccidentCategoryGuide from '@/pages/TruckAccidentCategoryGuide';
import SlipAndFallCategoryGuide from '@/pages/SlipAndFallCategoryGuide';
import MedicalMalpracticeCategoryGuide from '@/pages/MedicalMalpracticeCategoryGuide';
import WorkplaceInjuryCategoryGuide from '@/pages/WorkplaceInjuryCategoryGuide';
import MotorcycleAccidentCategoryGuide from '@/pages/MotorcycleAccidentCategoryGuide';
import RideshareAccidentCategoryGuide from '@/pages/RideshareAccidentCategoryGuide';
import PedestrianAccidentCategoryGuide from '@/pages/PedestrianAccidentCategoryGuide';
import DogBiteCategoryGuide from '@/pages/DogBiteCategoryGuide';
import WrongfulDeathCategoryGuide from '@/pages/WrongfulDeathCategoryGuide';
import CarAccidentStatuteOfLimitations from '@/pages/CarAccidentStatuteOfLimitations';
import { useRoute } from 'wouter';

// Wrapper component to pass route params to StateSpecificLanding
function StateSpecificLandingWrapper() {
  const [match, params] = useRoute('/injured/:state');
  if (!match) return null;
  return <StateSpecificLanding state={params.state} />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={GuidesHub} />
      <Route path={"/guides"} component={GuidesHub} />
      <Route path={"/guide"} component={GuidesHub} />
      <Route path={"/guide/car-accident/what-to-do"} component={WhatToDoAfterCarAccident} />
      <Route path={"/guide/car-accident/do-i-need-a-lawyer"} component={DoINeedALawyer} />
      <Route path={"/guide/car-accident/statute-of-limitations"} component={CarAccidentStatuteOfLimitations} />
       <Route path="/guide/car-accident" component={CarAccidentCategoryGuide} />
      <Route path="/guide/slip-and-fall" component={SlipAndFallCategoryGuide} />
      <Route path="/guide/truck-accident" component={TruckAccidentCategoryGuide} />
      <Route path="/guide/medical-malpractice" component={MedicalMalpracticeCategoryGuide} />
      <Route path="/guide/workplace-injury" component={WorkplaceInjuryCategoryGuide} />
      <Route path="/guide/motorcycle-accident" component={MotorcycleAccidentCategoryGuide} />
      <Route path="/guide/pedestrian-accident" component={PedestrianAccidentCategoryGuide} />
      <Route path="/guide/dog-bite" component={DogBiteCategoryGuide} />
      <Route path="/guide/wrongful-death" component={WrongfulDeathCategoryGuide} />
      <Route path="/guide/rideshare-accident" component={RideshareAccidentCategoryGuide} />
      <Route path="/guide/insurance-claim" component={InsuranceClaimGuide} />
      <Route path="/case-review" component={CaseReviewPage} />
      <Route path="/guides/:id" component={GuidePage} />
      <Route path={"/404"} component={NotFound} />
      <Route path="/free-case-review" component={CaseReviewPage} />
      <Route path="/guide/truck-accident/what-to-do" component={TruckAccidentWhatToDo} />
      <Route path="/guide/car-accident/rear-end" component={CarAccidentRearEnd} />
      <Route path="/guide/car-accident/t-bone" component={CarAccidentTBone} />
      <Route path="/guide/car-accident/hit-and-run" component={CarAccidentHitAndRun} />
      <Route path="/guide/car-accident/intersection" component={CarAccidentIntersection} />
      <Route path="/guide/car-accident/parking-lot" component={CarAccidentParkingLot} />
      <Route path="/guide/car-accident/multi-vehicle" component={CarAccidentMultiVehicle} />
      <Route path="/injured/:state" component={StateSpecificLandingWrapper} />
      <Route component={NotFound} />    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
