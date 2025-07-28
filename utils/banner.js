// const chalk = require("chalk")

// function showBanner() {
//   const banner = `
// ${chalk.hex("#6366f1")("╭──────────────────────────────╮")}
// ${chalk.hex("#6366f1")("│")} ${chalk.hex("#6366f1")("┌─[")}${chalk.hex("#47A248").bold("M")}${chalk.hex("#6366f1")("]─┬─[")}${chalk.hex("#000000").bold("E")}${chalk.hex("#6366f1")("]─┬─[")}${chalk.hex("#61DAFB").bold("R")}${chalk.hex("#6366f1")("]─┬─[")}${chalk.hex("#339933").bold("N")}${chalk.hex("#6366f1")("]─┐")} ${chalk.hex("#6366f1")("│")}
// ${chalk.hex("#6366f1")("│")} ${chalk.hex("#6366f1")("│")}  ${chalk.hex("#47A248")("🍃")} ${chalk.hex("#6366f1")("│")} ${chalk.hex("#000000")("⚡")}  ${chalk.hex("#6366f1")("│")} ${chalk.hex("#61DAFB")("⚛️")}  ${chalk.hex("#6366f1")("│")} ${chalk.hex("#339933")("🟢")}  ${chalk.hex("#6366f1")("│")} ${chalk.hex("#6366f1")("│")}
// ${chalk.hex("#6366f1")("│")} ${chalk.hex("#6366f1")("└─────┴─────┴─────┴─────┘")} ${chalk.hex("#6366f1")("│")}
// ${chalk.hex("#6366f1")("│")}   ${chalk.white.bold("MERN Stack Generator")}       ${chalk.hex("#6366f1")("│")}
// ${chalk.hex("#6366f1")("╰──────────────────────────────╯")}

// ${chalk.greenBright("🚀 Set up your entire MERN stack with just one command!")}
// `

//   console.log(banner)
// }

// module.exports = showBanner


// const chalk = require("chalk");

// function showBanner() {
//   const line = chalk.hex("#6366f1");
//   const labelM = chalk.hex("#47A248").bold("M");
//   const labelE = chalk.hex("#e0e0e0ff").bold("E");
//   const labelR = chalk.hex("#61DAFB").bold("R");
//   const labelN = chalk.hex("#339933").bold("N");

//   const iconM = chalk.hex("#47A248")("🍃");
//   const iconE = chalk.hex("#000000")("⚡");
//   const iconR = chalk.hex("#61DAFB")("⚛");
//   const iconN = chalk.hex("#339933")("🟢");

//   const banner = `
// ${line("  ╭───────────────────────────────╮")}
// ${line("  │")} ${line("┌─[")}${labelM}${line("]──┬──[")}${labelE}${line("]─┬─[")}${labelR}${line("]──┬─[")}${labelN}${line("]──┐")} ${line("│")}
// ${line("  │")} ${line("│")}  ${iconM}  ${line("│")}  ${iconE}  ${line("│")} ${iconR}  ${line("  │")} ${iconN}  ${line(" │")} ${line("│")}
// ${line("  │")} ${line("└──────┴──────┴──────┴──────┘")} ${line("│")}
// ${line("  │")}     ${chalk.white.bold("     M  E  R  N         ")}  ${line("│")}
// ${line("╭─╰───────────────────────────────╯")}
// ${chalk.gray("└─── o➤")} ${chalk.greenBright("🚀 Set up your entire MERN stack with just one command!")}
// `;

//   console.log(banner);
// }

// module.exports = showBanner;





const chalk = require("chalk");

function showBanner() {
  const line = chalk.hex("#6366f1");
  const labelM = chalk.hex("#47A248").bold("M");
  const labelE = chalk.hex("#facc15").bold("E");
  const labelR = chalk.hex("#61DAFB").bold("R");
  const labelN = chalk.hex("#3eb34f").bold("N");
  const labelX = chalk.hex("#a855f7").bold("EX");

  const iconM = chalk.hex("#47A248")("🍃");    // MongoDB
  const iconE = chalk.hex("#facc15")("⚡");     // Express
  const iconR = chalk.hex("#61DAFB")("⚛");     // React
  const iconN = chalk.hex("#3eb34f")("🟢");     // Node
  const iconX = chalk.hex("#a855f7")("📦");     // Extra/Extension

  const banner = `
${line("  ╭─────────────────────────────────────╮")}
${line("  │")} ${line("┌─[")}${labelM}${line("]──┬─[")}${labelE}${line("]──┬─[")}${labelR}${line("]─┬─[")}${labelN}${line("]──┬─[")}${labelX}${line("]─┐")} ${line("│")}
${line("  │")} ${line("│")}  ${iconM}  ${line("│")}  ${iconE}  ${line("│")} ${iconR}  ${line(" │")} ${iconN}  ${line(" │")} ${iconX}  ${line(" │")} ${line("│")}
${line("  │")} ${line("└──────┴──────┴─────┴──────┴──────┘")} ${line("│")}
${line("  │")}   ${chalk.white.bold(" M  E  R  N    +   Extensions")}  ${line("   │")}
${line("╭─╰─────────────────────────────────────╯")}
${chalk.gray("└─── o➤")} ${chalk.greenBright("🚀 Set up your fullstack or modular project in seconds!")}
`;

  console.log(banner);
}

module.exports = showBanner;

