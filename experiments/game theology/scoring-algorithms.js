// COSMOLOGY & COOPERATION GAME - SCORING ALGORITHMS

// BELIEF PROFILE CALCULATOR
export function calculateBeliefProfile(answers) {
  let profile = {
    // Base scores (0-100 scales)
    temporalModel: "uncertain",
    ontology: "uncertain",
    goalOriented: 50,
    worldValue: 0,
    urgency: 50,
    tribalism: 50,
    zeroSum: 50,
    forgivenessOrientation: 0,
    certainty: 0
  };
  
  // Import questionnaire to access score data
  const QUESTIONNAIRE = window.QUESTIONNAIRE || {};
  
  // Accumulate scores from each answer
  for (let [qId, answer] of Object.entries(answers)) {
    let question = QUESTIONNAIRE[qId];
    if (!question) continue;
    
    let scores = question.scores;
    
    // Handle function-based scores (like sliders)
    if (typeof scores === 'function') {
      scores = scores(answer);
    } else if (scores[answer]) {
      scores = scores[answer];
    } else {
      continue;
    }
    
    // Apply scores
    for (let [key, value] of Object.entries(scores)) {
      if (typeof value === 'number') {
        profile[key] = Math.max(0, Math.min(100, profile[key] + value));
      } else {
        profile[key] = value;
      }
    }
  }
  
  // Derive composite categories
  profile.cosmologyType = deriveCosmologyType(profile);
  profile.strategicArchetype = deriveStrategicArchetype(profile);
  
  return profile;
}

// COSMOLOGY TYPE DERIVATION
function deriveCosmologyType(profile) {
  let scores = {};
  
  // GNOSTIC PATTERN
  scores.gnostic = 0;
  if (profile.ontology === "dualist") scores.gnostic += 30;
  if (profile.worldValue < -20) scores.gnostic += 30;
  if (profile.goalOriented > 60) scores.gnostic += 20;
  if (profile.urgency > 60) scores.gnostic += 20;
  
  // KASHMIR SHAIVISM PATTERN
  scores.shaivite = 0;
  if (profile.ontology === "monist") scores.shaivite += 40;
  if (profile.worldValue > 10) scores.shaivite += 20;
  if (profile.goalOriented < 40) scores.shaivite += 20;
  if (profile.urgency < 40) scores.shaivite += 20;
  
  // CHRISTIAN PATTERN (Hybrid)
  scores.christian = 0;
  if (profile.temporalModel === "finite") scores.christian += 25;
  if (profile.goalOriented > 50 && profile.goalOriented < 80) scores.christian += 25;
  if (profile.forgivenessOrientation > 10) scores.christian += 25;
  if (profile.tribalism > 30 && profile.tribalism < 70) scores.christian += 25;
  
  // BUDDHIST PATTERN
  scores.buddhist = 0;
  if (profile.temporalModel === "cyclical") scores.buddhist += 30;
  if (profile.worldValue < 0 && profile.worldValue > -30) scores.buddhist += 20;
  if (profile.forgivenessOrientation > 20) scores.buddhist += 30;
  if (profile.tribalism < 30) scores.buddhist += 20;
  
  // HERMETIC PATTERN
  scores.hermetic = 0;
  if (profile.ontology === "monist" || profile.ontology === "hierarchical_monist") scores.hermetic += 30;
  if (profile.worldValue > -10 && profile.worldValue < 20) scores.hermetic += 20;
  if (profile.goalOriented > 30 && profile.goalOriented < 70) scores.hermetic += 30;
  if (profile.zeroSum < 30) scores.hermetic += 20;
  
  // APOCALYPTIC PATTERN
  scores.apocalyptic = 0;
  if (profile.urgency > 70) scores.apocalyptic += 40;
  if (profile.goalOriented > 70) scores.apocalyptic += 30;
  if (profile.tribalism > 60) scores.apocalyptic += 30;
  
  return scores;
}

// STRATEGIC ARCHETYPE DERIVATION
function deriveStrategicArchetype(profile) {
  if (profile.urgency > 70 && profile.zeroSum > 50) {
    return "apocalyptic_defector";
  } else if (profile.tribalism > 60 && profile.zeroSum > 40) {
    return "tribal_cooperator";
  } else if (profile.forgivenessOrientation > 30 && profile.zeroSum < 30) {
    return "universal_cooperator";
  } else if (profile.goalOriented < 40 && profile.urgency < 40) {
    return "infinite_player";
  } else if (profile.ontology === "dualist" && profile.worldValue < -20) {
    return "gnostic_minimalist";
  } else {
    return "pragmatic_adapter";
  }
}

// BEHAVIOR ANALYSIS
export function analyzeBehavior(gameData) {
  let behavior = {
    cooperationRate: 0,
    firstMoveCooperation: false,
    forgivenessRate: 0,
    exploitationRate: 0,
    lastRoundDefection: false,
    scarcityResponse: "maintain",
    labelBias: 0,
    strategyConsistency: 0,
    adaptiveness: 0,
    clarityScore: 0,
    totalScore: 0,
    opponentScore: 0
  };
  
  if (!gameData || gameData.length === 0) return behavior;
  
  let totalRounds = gameData.length;
  let cooperations = 0;
  let forgaveCount = 0;
  let forgaveOpportunities = 0;
  let exploitedCount = 0;
  let exploitOpportunities = 0;
  
  gameData.forEach((round, index) => {
    // Cooperation rate
    if (round.playerMove === "cooperate") {
      cooperations++;
    }
    
    // Scores
    behavior.totalScore += round.playerPoints || 0;
    behavior.opponentScore += round.opponentPoints || 0;
    
    // First move
    if (index === 0) {
      behavior.firstMoveCooperation = round.playerMove === "cooperate";
    }
    
    // Forgiveness: cooperate after opponent defected
    if (index > 0 && gameData[index - 1].opponentMove === "defect") {
      forgaveOpportunities++;
      if (round.playerMove === "cooperate") {
        forgaveCount++;
      }
    }
    
    // Exploitation: defect when opponent cooperates
    if (round.opponentMove === "cooperate") {
      exploitOpportunities++;
      if (round.playerMove === "defect") {
        exploitedCount++;
      }
    }
    
    // Last round defection
    if (round.context && round.context.includes("last_round") && round.playerMove === "defect") {
      behavior.lastRoundDefection = true;
    }
    
    // Scarcity response
    if (round.context && round.context.includes("scarcity")) {
      let scarcityCoopRate = round.playerMove === "cooperate" ? 1 : 0;
      let normalCoopRate = cooperations / Math.max(1, index);
      if (scarcityCoopRate < normalCoopRate - 0.2) {
        behavior.scarcityResponse = "decrease";
      } else if (scarcityCoopRate > normalCoopRate + 0.2) {
        behavior.scarcityResponse = "increase";
      }
    }
    
    // Label bias tracking
    if (round.context && round.context.includes("labeled")) {
      if (round.context.includes("ingroup") && round.playerMove === "cooperate") {
        behavior.labelBias += 10;
      } else if (round.context.includes("outgroup") && round.playerMove === "defect") {
        behavior.labelBias += 10;
      }
    }
  });
  
  behavior.cooperationRate = (cooperations / totalRounds) * 100;
  behavior.forgivenessRate = forgaveOpportunities > 0 
    ? (forgaveCount / forgaveOpportunities) * 100 
    : 50;
  behavior.exploitationRate = exploitOpportunities > 0
    ? (exploitedCount / exploitOpportunities) * 100
    : 0;
  
  // Strategy consistency and clarity
  behavior.strategyConsistency = calculateConsistency(gameData);
  behavior.clarityScore = behavior.strategyConsistency;
  
  // Adaptiveness
  behavior.adaptiveness = calculateAdaptiveness(gameData);
  
  return behavior;
}

// CONSISTENCY CALCULATION
function calculateConsistency(gameData) {
  if (gameData.length < 3) return 50;
  
  let patterns = {};
  let totalContexts = 0;
  
  gameData.forEach((round, index) => {
    if (index === 0) return;
    
    let context = gameData[index - 1].opponentMove;
    if (!patterns[context]) patterns[context] = { cooperate: 0, defect: 0 };
    patterns[context][round.playerMove]++;
    totalContexts++;
  });
  
  let consistency = 0;
  for (let context in patterns) {
    let total = patterns[context].cooperate + patterns[context].defect;
    let dominant = Math.max(patterns[context].cooperate, patterns[context].defect);
    consistency += (dominant / total) * (total / totalContexts);
  }
  
  return consistency * 100;
}

// ADAPTIVENESS CALCULATION
function calculateAdaptiveness(gameData) {
  if (gameData.length < 4) return 50;
  
  let adaptiveResponses = 0;
  let opportunities = 0;
  
  for (let i = 2; i < gameData.length; i++) {
    let prev2 = gameData[i - 2].opponentMove;
    let prev1 = gameData[i - 1].opponentMove;
    
    if (prev2 !== prev1) {
      opportunities++;
      if (i + 1 < gameData.length) {
        let playerResponse = gameData[i + 1].playerMove;
        if (prev1 === "cooperate" && playerResponse === "cooperate") adaptiveResponses++;
        if (prev1 === "defect" && playerResponse === "defect") adaptiveResponses++;
      }
    }
  }
  
  return opportunities > 0 ? (adaptiveResponses / opportunities) * 100 : 50;
}

// BIAS DETECTION
export function detectBiases(beliefProfile, behaviorProfile) {
  let biases = [];
  
  // BIAS 1: Eschatological Defection
  if (behaviorProfile.lastRoundDefection && 
      (beliefProfile.temporalModel === "finite" || beliefProfile.urgency > 60)) {
    biases.push({
      id: "eschatological_defection",
      name: "Eschatological Defection Bias",
      severity: "high",
      description: "You defected when you believed the game was ending.",
      cosmology: `Your ${beliefProfile.temporalModel} worldview and urgency (${Math.round(beliefProfile.urgency)}/100) prime you for "last round" thinking.`,
      mechanism: "Finite-game cosmologies create deadline anxiety. When you sense an ending, short-term exploitation seems rational.",
      realWorldImpact: [
        "Difficulty maintaining trust when sensing 'endings' (relationship troubles, job changes)",
        "Temptation to 'cash out' rather than invest in long-term relationships",
        "Self-fulfilling prophecies: your defection causes others to defect"
      ],
      gameTheoryTruth: "Most real situations don't have known final rounds. Uncertainty maintains cooperation.",
      score: 85
    });
  }
  
  // BIAS 2: Zero-Sum Exploitation
  if (behaviorProfile.exploitationRate > 40 && beliefProfile.zeroSum > 50) {
    biases.push({
      id: "zero_sum_exploitation",
      name: "Zero-Sum Exploitation Bias",
      severity: behaviorProfile.exploitationRate > 60 ? "high" : "medium",
      description: `You defected against cooperative partners ${Math.round(behaviorProfile.exploitationRate)}% of the time.`,
      cosmology: `Your zero-sum thinking (${Math.round(beliefProfile.zeroSum)}/100) creates a "someone must lose" mentality.`,
      mechanism: "When you see resources as fixed, cooperation looks like weakness to exploit.",
      realWorldImpact: [
        "Missed collaborative opportunities",
        "Damaged reputation (people learn not to trust you)",
        "Suboptimal outcomes (mutual cooperation scores higher than exploitation)"
      ],
      gameTheoryTruth: "Axelrod proved that in iterated games, exploiters lose to cooperators long-term.",
      score: Math.min(100, behaviorProfile.exploitationRate + beliefProfile.zeroSum / 2)
    });
  }
  
  // BIAS 3: Unforgiving Retaliation
  if (behaviorProfile.forgivenessRate < 30) {
    let cosmologyExplanation = "";
    if (beliefProfile.temporalModel === "finite") {
      cosmologyExplanation = "Finite-game thinking: 'No time for second chances'";
    } else if (beliefProfile.ontology === "dualist") {
      cosmologyExplanation = "Dualist thinking: 'Once evil, always evil'";
    } else {
      cosmologyExplanation = "Rigid justice orientation";
    }
    
    biases.push({
      id: "eternal_grudge",
      name: "Eternal Grudge Pattern",
      severity: "medium",
      description: `You only forgave ${Math.round(behaviorProfile.forgivenessRate)}% of betrayals.`,
      cosmology: cosmologyExplanation,
      mechanism: "Seeing betrayal as permanent character rather than temporary choice prevents reconciliation.",
      realWorldImpact: [
        "Difficulty repairing relationships",
        "Escalating conflicts (both sides retaliate eternally)",
        "Social isolation",
        "Missing out on reformed partners"
      ],
      gameTheoryTruth: "Tit-for-Tat (the winning strategy) forgives after retaliating once. Eternal grudges score poorly.",
      score: 100 - behaviorProfile.forgivenessRate
    });
  }
  
  // BIAS 4: Naive Unconditional Cooperation
  if (behaviorProfile.cooperationRate > 90 && behaviorProfile.exploitationRate === 0 && behaviorProfile.forgivenessRate > 80) {
    biases.push({
      id: "naive_cooperation",
      name: "Naive Cooperation Vulnerability",
      severity: "medium",
      description: "You cooperated unconditionally, even after repeated betrayal.",
      cosmology: beliefProfile.temporalModel === "infinite" || beliefProfile.temporalModel === "cyclical"
        ? "Infinite-game patience makes you exploitable"
        : "Universal love without boundaries",
      mechanism: "Cooperation without retaliation rewards bad behavior and enables exploitation.",
      realWorldImpact: [
        "Vulnerability to manipulation",
        "Enabling toxic behavior",
        "Personal resource depletion",
        "Others may perceive you as weak or naive"
      ],
      gameTheoryTruth: "Always Cooperate loses to Tit-for-Tat. Optimal strategies are 'nice but not naive'—cooperate first, but retaliate when exploited.",
      score: 70
    });
  }
  
  // BIAS 5: Tribal Cooperation
  if (behaviorProfile.labelBias > 20 && beliefProfile.tribalism > 50) {
    biases.push({
      id: "tribal_cooperation",
      name: "Tribal Cooperation Bias",
      severity: "medium",
      description: "You cooperated more with 'in-group' labeled partners.",
      cosmology: `Your tribal thinking (${Math.round(beliefProfile.tribalism)}/100) creates asymmetric trust.`,
      mechanism: "Belief in chosen/saved groups makes you pre-judge partners based on labels.",
      realWorldImpact: [
        "Limited social capital",
        "Sectarianism",
        "Inability to build diverse coalitions",
        "Missing beneficial partnerships"
      ],
      gameTheoryTruth: "Labels don't predict behavior. Tit-for-Tat treats everyone the same initially—judge by actions, not categories.",
      score: (behaviorProfile.labelBias + beliefProfile.tribalism) / 2
    });
  }
  
  // BIAS 6: Scarcity Panic
  if (behaviorProfile.scarcityResponse === "decrease" && beliefProfile.urgency > 60) {
    biases.push({
      id: "scarcity_panic",
      name: "Scarcity-Induced Defection",
      severity: "high",
      description: "You became less cooperative when resources seemed scarce.",
      cosmology: `Your urgency (${Math.round(beliefProfile.urgency)}/100) triggers hoarding when stressed.`,
      mechanism: "Apocalyptic thinking creates 'lifeboat ethics'—when resources shrink, cooperation collapses.",
      realWorldImpact: [
        "Crisis breakdown",
        "Inability to cooperate under pressure",
        "Tragedy of the commons failures",
        "Panic-driven decisions harm everyone"
      ],
      gameTheoryTruth: "Cooperation is MOST important in scarcity. Mutual defection = everyone dies. Mutual cooperation = survival.",
      score: 90
    });
  }
  
  // BIAS 7: Strategic Opacity
  if (behaviorProfile.clarityScore < 50) {
    biases.push({
      id: "strategic_opacity",
      name: "Strategic Opacity",
      severity: "low",
      description: "Your strategy was inconsistent and hard to read.",
      cosmology: "Complex or uncertain beliefs create confused ethical frameworks.",
      mechanism: "When your principles are unclear even to yourself, behavior becomes erratic.",
      realWorldImpact: [
        "Others can't trust you because they can't predict you",
        "Cooperation requires clarity",
        "Your own decision-making is stressful"
      ],
      gameTheoryTruth: "Clear strategies (like Tit-for-Tat) outperform complex ones. Simplicity enables coordination.",
      score: 100 - behaviorProfile.clarityScore
    });
  }
  
  // Sort by score
  biases.sort((a, b) => b.score - a.score);
  
  return biases;
}

// COSMOLOGICAL MATCHING
export function matchCosmologies(beliefProfile, behaviorProfile) {
  let cosmologyScores = beliefProfile.cosmologyType;
  
  let matches = Object.entries(cosmologyScores)
    .map(([name, score]) => ({
      name: formatCosmologyName(name),
      score: Math.round(score),
      description: getCosmologyDescription(name),
      predictedBehavior: getPredictedBehavior(name),
      actualFit: calculateFit(name, behaviorProfile)
    }))
    .sort((a, b) => b.score - a.score);
  
  return matches;
}

function formatCosmologyName(key) {
  const names = {
    gnostic: "Gnostic Christianity",
    shaivite: "Kashmir Shaivism",
    christian: "Mainstream Christianity",
    buddhist: "Mahayana Buddhism",
    hermetic: "Hermetic Philosophy",
    apocalyptic: "Apocalyptic Movements"
  };
  return names[key] || key;
}

function getCosmologyDescription(key) {
  const descriptions = {
    gnostic: "Material world as prison, urgent escape, dualistic battle",
    shaivite: "Eternal play of consciousness, non-dual, no urgency",
    christian: "Created world with loving goal, balance of justice and mercy",
    buddhist: "Cyclical existence, compassion for all, gradual liberation",
    hermetic: "As above so below, mental universe, hierarchical unity",
    apocalyptic: "Imminent end times, stark good/evil, insider/outsider"
  };
  return descriptions[key] || "";
}

function getPredictedBehavior(key) {
  const behaviors = {
    gnostic: "World-rejection, in-group loyalty, last-round defection",
    shaivite: "Universal cooperation, high forgiveness, consistent play",
    christian: "Cooperative with forgiveness, some tribalism, goal-driven",
    buddhist: "Universal compassion, high forgiveness, patient",
    hermetic: "Balanced cooperation, adaptive, seeks harmony",
    apocalyptic: "Urgent action, tribal loyalty, scarcity panic"
  };
  return behaviors[key] || "";
}

function calculateFit(cosmologyType, behaviorProfile) {
  let expectedBehavior = {};
  
  switch(cosmologyType) {
    case "gnostic":
      expectedBehavior = {
        cooperationRate: 40,
        forgivenessRate: 20,
        lastRoundDefection: true
      };
      break;
    case "shaivite":
      expectedBehavior = {
        cooperationRate: 80,
        forgivenessRate: 80,
        lastRoundDefection: false
      };
      break;
    case "christian":
      expectedBehavior = {
        cooperationRate: 70,
        forgivenessRate: 60,
        lastRoundDefection: false
      };
      break;
    case "buddhist":
      expectedBehavior = {
        cooperationRate: 85,
        forgivenessRate: 85,
        lastRoundDefection: false
      };
      break;
    case "hermetic":
      expectedBehavior = {
        cooperationRate: 65,
        forgivenessRate: 55,
        lastRoundDefection: false
      };
      break;
    case "apocalyptic":
      expectedBehavior = {
        cooperationRate: 35,
        forgivenessRate: 15,
        lastRoundDefection: true
      };
      break;
    default:
      return 50;
  }
  
  let deviation = 0;
  let factors = 0;
  
  for (let key in expectedBehavior) {
    if (typeof expectedBehavior[key] === 'boolean') {
      deviation += behaviorProfile[key] === expectedBehavior[key] ? 0 : 30;
    } else {
      deviation += Math.abs(behaviorProfile[key] - expectedBehavior[key]);
    }
    factors++;
  }
  
  return Math.max(0, Math.round(100 - (deviation / factors)));
}
