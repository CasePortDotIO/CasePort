// Loads the verbatim source data modules (side-effect imports) in the same
// order the source HTML loaded them, populating the shared CP object.
import { CP } from "./_cp";
import "./_src/states";
import "./_src/accident-types";
import "./_src/quick-answers";
import "./_src/cities";
import "./_src/state-law";
import "./_src/resources";
import "./_src/injuries";
import "./_src/guides";
import "./_src/glossary";
// derived helpers that depend on the data above
import "./_src/state-law-gen";

export { CP };
