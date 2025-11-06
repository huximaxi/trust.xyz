// COSMOLOGY & COOPERATION GAME - TRUST GAME LOGIC

// Payoff matrix for Prisoner's Dilemma
const PAYOFFS = {
  both_cooperate: { player: 3, opponent: 3 },
  player_defects: { player: 5, opponent: 0 },
  opponent_defects: { player: 0, opponent: 5 },
  both_defect: { player: 1, opponent: 1 }
};

// Game Scenarios
export class TrustGame {
  constructor(beliefProfile) {
    this.beliefProfile = beliefProfile;
    this.gameData = [];
    this.currentScenario = null;
    this.currentRound = 0;
    this.scenarios = this.generateScenarios();
    this.totalRounds = this.calculateTotalRounds();
  }
  
  generateScenarios() {
    let scenarios = [
      new FoundationRound(5),
      new TemptationRound(3),
      new BetrayalRound(1),
      new UncertainFuture(7)
    ];
    
    // Add personalized scenarios based on beliefs
    if (this.beliefProfile.temporalModel === "finite" || this.beliefProfile.urgency > 60) {
      scenarios.push(new AnnouncedLastRound());
      scenarios.push(new SurpriseExtraRound());
    }
    
    if (this.beliefProfile.tribalism > 50) {
      scenarios.push(new LabeledPartnerRound(2, "ingroup"));
      scenarios.push(new LabeledPartnerRound(2, "outgroup"));
    }
    
    if (this.beliefProfile.urgency > 60) {
      scenarios.push(new ScarcityRound(3));
    }
    
    return scenarios;
  }
  
  calculateTotalRounds() {
    return this.scenarios.reduce((sum, scenario) => sum + scenario.rounds, 0);
  }
  
  getCurrentScenario() {
    let roundCount = 0;
    for (let scenario of this.scenarios) {
      roundCount += scenario.rounds;
      if (this.currentRound < roundCount) {
        return scenario;
      }
    }
    return null;
  }
  
  playRound(playerChoice) {
    this.currentScenario = this.getCurrentScenario();
    if (!this.currentScenario) {
      return null; // Game over
    }
    
    let opponentMove = this.currentScenario.getOpponentMove(this.gameData, this.beliefProfile);
    let outcome = this.calculateOutcome(playerChoice, opponentMove);
    
    let roundData = {
      round: this.currentRound + 1,
      playerMove: playerChoice,
      opponentMove: opponentMove,
      playerPoints: outcome.player,
      opponentPoints: outcome.opponent,
      context: this.currentScenario.getContext(this.currentRound, this.gameData),
      scenarioName: this.currentScenario.name
    };
    
    this.gameData.push(roundData);
    this.currentRound++;
    
    return roundData;
  }
  
  calculateOutcome(playerChoice, opponentChoice) {
    if (playerChoice === "cooperate" && opponentChoice === "cooperate") {
      return PAYOFFS.both_cooperate;
    } else if (playerChoice === "defect" && opponentChoice === "cooperate") {
      return PAYOFFS.player_defects;
    } else if (playerChoice === "cooperate" && opponentChoice === "defect") {
      return PAYOFFS.opponent_defects;
    } else {
      return PAYOFFS.both_defect;
    }
  }
  
  isGameOver() {
    return this.currentRound >= this.totalRounds;
  }
  
  getGameData() {
    return this.gameData;
  }
  
  getProgress() {
    return {
      current: this.currentRound,
      total: this.totalRounds,
      percentage: (this.currentRound / this.totalRounds) * 100
    };
  }
}

// Base Scenario Class
class Scenario {
  constructor(rounds, name) {
    this.rounds = rounds;
    this.name = name;
  }
  
  getOpponentMove(history, beliefProfile) {
    return "cooperate";
  }
  
  getContext(currentRound, history) {
    return [];
  }
  
  getFraming(beliefProfile) {
    return {
      cooperateText: "Cooperate",
      defectText: "Defect",
      partnerLabel: "Partner"
    };
  }
}

// SCENARIO 1: Foundation Round (Tit-for-Tat)
class FoundationRound extends Scenario {
  constructor(rounds) {
    super(rounds, "Foundation");
  }
  
  getOpponentMove(history) {
    if (history.length === 0) {
      return "cooperate"; // Start nice
    }
    // Tit-for-Tat: copy player's last move
    return history[history.length - 1].playerMove;
  }
  
  getContext() {
    return ["foundation"];
  }
}

// SCENARIO 2: Temptation Round (Always Cooperate)
class TemptationRound extends Scenario {
  constructor(rounds) {
    super(rounds, "Temptation");
  }
  
  getOpponentMove() {
    return "cooperate"; // Always cooperate
  }
  
  getContext() {
    return ["temptation"];
  }
}

// SCENARIO 3: Betrayal Round (Sudden Defection)
class BetrayalRound extends Scenario {
  constructor(rounds) {
    super(rounds, "Betrayal");
  }
  
  getOpponentMove() {
    return "defect"; // Betray
  }
  
  getContext() {
    return ["betrayal"];
  }
}

// SCENARIO 4: Uncertain Future (Tit-for-Tat again)
class UncertainFuture extends Scenario {
  constructor(rounds) {
    super(rounds, "Uncertain Future");
  }
  
  getOpponentMove(history) {
    if (history.length === 0) {
      return "cooperate";
    }
    return history[history.length - 1].playerMove;
  }
  
  getContext() {
    return ["uncertain"];
  }
}

// SCENARIO 5: Announced Last Round
class AnnouncedLastRound extends Scenario {
  constructor() {
    super(1, "Last Round");
  }
  
  getOpponentMove() {
    return "cooperate"; // Test if player defects
  }
  
  getContext() {
    return ["last_round", "announcement"];
  }
  
  getAnnouncement() {
    return "⚠️ This is the FINAL ROUND";
  }
}

// SCENARIO 6: Surprise Extra Round
class SurpriseExtraRound extends Scenario {
  constructor() {
    super(1, "Surprise Round");
  }
  
  getOpponentMove(history) {
    // Mirror player's choice from "last round"
    if (history.length > 0) {
      return history[history.length - 1].playerMove;
    }
    return "cooperate";
  }
  
  getContext() {
    return ["surprise", "extra_round"];
  }
  
  getAnnouncement() {
    return "Actually... one more round!";
  }
}

// SCENARIO 7: Labeled Partner (In-group/Out-group)
class LabeledPartnerRound extends Scenario {
  constructor(rounds, label) {
    super(rounds, `Labeled ${label}`);
    this.label = label; // "ingroup" or "outgroup"
  }
  
  getOpponentMove(history) {
    if (history.length === 0) {
      return "cooperate";
    }
    return history[history.length - 1].playerMove;
  }
  
  getContext() {
    return ["labeled", this.label];
  }
  
  getFraming(beliefProfile) {
    if (this.label === "ingroup") {
      return {
        cooperateText: "Share with your group",
        defectText: "Take for yourself",
        partnerLabel: "Fellow Seeker"
      };
    } else {
      return {
        cooperateText: "Share with outsider",
        defectText: "Protect your resources",
        partnerLabel: "Outsider"
      };
    }
  }
}

// SCENARIO 8: Scarcity Round
class ScarcityRound extends Scenario {
  constructor(rounds) {
    super(rounds, "Scarcity");
  }
  
  getOpponentMove(history) {
    if (history.length === 0) {
      return "cooperate";
    }
    return history[history.length - 1].playerMove;
  }
  
  getContext() {
    return ["scarcity"];
  }
  
  getAnnouncement() {
    return "⚠️ Resources are now scarce";
  }
}

// Framing text based on belief profile
export function getFramedText(scenario, beliefProfile) {
  const baseFraming = scenario.getFraming(beliefProfile);
  
  // Customize based on cosmology
  if (beliefProfile.ontology === "dualist" && beliefProfile.worldValue < -20) {
    // Gnostic framing
    return {
      cooperateText: baseFraming.cooperateText || "Share gnosis",
      defectText: baseFraming.defectText || "Hoard light particles",
      partnerLabel: baseFraming.partnerLabel || "Fellow spark",
      currencyName: "Light Particles"
    };
  } else if (beliefProfile.ontology === "monist" && beliefProfile.urgency < 40) {
    // Kashmir Shaivism framing
    return {
      cooperateText: baseFraming.cooperateText || "Dance in harmony",
      defectText: baseFraming.defectText || "Play discord",
      partnerLabel: baseFraming.partnerLabel || "Another mask of consciousness",
      currencyName: "Consciousness Points"
    };
  } else if (beliefProfile.cosmologyType && beliefProfile.cosmologyType.christian > 50) {
    // Christian framing
    return {
      cooperateText: baseFraming.cooperateText || "Love thy neighbor",
      defectText: baseFraming.defectText || "Act in self-interest",
      partnerLabel: baseFraming.partnerLabel || "Fellow traveler",
      currencyName: "Treasures"
    };
  } else {
    // Neutral framing
    return {
      cooperateText: baseFraming.cooperateText || "Cooperate",
      defectText: baseFraming.defectText || "Defect",
      partnerLabel: baseFraming.partnerLabel || "Partner",
      currencyName: "Points"
    };
  }
}

// Helper to get scenario announcement if any
export function getScenarioAnnouncement(scenario) {
  if (typeof scenario.getAnnouncement === 'function') {
    return scenario.getAnnouncement();
  }
  return null;
}

// Calculate comparison scores
export function calculateComparisons(gameData) {
  let playerScore = gameData.reduce((sum, round) => sum + round.playerPoints, 0);
  let opponentScore = gameData.reduce((sum, round) => sum + round.opponentPoints, 0);
  
  // Simulate other strategies
  let titForTatScore = simulateTitForTat(gameData);
  let alwaysCooperateScore = simulateAlwaysCooperate(gameData);
  let alwaysDefectScore = simulateAlwaysDefect(gameData);
  
  return {
    player: playerScore,
    opponent: opponentScore,
    titForTat: titForTatScore,
    alwaysCooperate: alwaysCooperateScore,
    alwaysDefect: alwaysDefectScore
  };
}

function simulateTitForTat(gameData) {
  let score = 0;
  let lastOpponentMove = null;
  
  gameData.forEach(round => {
    let titForTatMove = lastOpponentMove || "cooperate";
    let outcome = getOutcome(titForTatMove, round.opponentMove);
    score += outcome;
    lastOpponentMove = round.opponentMove;
  });
  
  return score;
}

function simulateAlwaysCooperate(gameData) {
  let score = 0;
  gameData.forEach(round => {
    let outcome = getOutcome("cooperate", round.opponentMove);
    score += outcome;
  });
  return score;
}

function simulateAlwaysDefect(gameData) {
  let score = 0;
  gameData.forEach(round => {
    let outcome = getOutcome("defect", round.opponentMove);
    score += outcome;
  });
  return score;
}

function getOutcome(playerMove, opponentMove) {
  if (playerMove === "cooperate" && opponentMove === "cooperate") {
    return PAYOFFS.both_cooperate.player;
  } else if (playerMove === "defect" && opponentMove === "cooperate") {
    return PAYOFFS.player_defects.player;
  } else if (playerMove === "cooperate" && opponentMove === "defect") {
    return PAYOFFS.opponent_defects.player;
  } else {
    return PAYOFFS.both_defect.player;
  }
}
