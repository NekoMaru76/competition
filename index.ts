require("dotenv").config();

import run from "./src/index";
import { prefix, colorList } from "./config.json";
import type { ColorList } from "./src/Structures/Color/Color";

run(prefix, colorList as ColorList);