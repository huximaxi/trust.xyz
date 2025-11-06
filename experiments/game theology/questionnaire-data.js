// COSMOLOGY & COOPERATION GAME - QUESTIONNAIRE DATA
// Belief probing questions with branching logic

export const QUESTIONNAIRE = {
  // SECTION 1: TEMPORAL COSMOLOGY
  
  q1: {
    id: "temporal_beginning",
    section: "Temporal Cosmology",
    text: "Do you believe the universe had a beginning?",
    type: "single",
    options: [
      { value: "yes", text: "Yes, it was created at a specific point", next: "q2" },
      { value: "no", text: "No, it has always existed", next: "q3" },
      { value: "cycle", text: "It cycles between creation and destruction", next: "q3" },
      { value: "unsure", text: "I'm not sure", next: "q2" }
    ],
    scores: {
      yes: { temporal: "finite", certainty: 1 },
      no: { temporal: "infinite", certainty: 1 },
      cycle: { temporal: "cyclical", certainty: 1 },
      unsure: { temporal: "uncertain", certainty: 0 }
    }
  },
  
  q2: {
    id: "temporal_ending",
    section: "Temporal Cosmology",
    text: "Do you believe the universe will have an end?",
    type: "single",
    condition: (prev) => prev.q1 === "yes" || prev.q1 === "unsure",
    options: [
      { value: "yes", text: "Yes, there will be a final ending", next: "q4" },
      { value: "transformed", text: "It will be transformed into something new", next: "q4" },
      { value: "no", text: "No, it will continue forever", next: "q4" },
      { value: "unsure", text: "I don't know", next: "q4" }
    ],
    scores: {
      yes: { eschatology: "apocalyptic", urgency: 30 },
      transformed: { eschatology: "transformative", urgency: 15 },
      no: { eschatology: "eternal", urgency: -10 },
      unsure: { urgency: 0 }
    }
  },
  
  q3: {
    id: "time_experience",
    section: "Temporal Cosmology",
    text: "How do you experience time?",
    type: "single",
    condition: (prev) => prev.q1 === "no" || prev.q1 === "cycle",
    options: [
      { value: "arrow", text: "As an arrow pointing forward (linear)", next: "q4" },
      { value: "wheel", text: "As a wheel returning to itself (cyclical)", next: "q4" },
      { value: "spiral", text: "As a spiral (cyclical but evolving)", next: "q4" },
      { value: "illusion", text: "As an illusion", next: "q4" }
    ],
    scores: {
      arrow: { timeModel: "linear" },
      wheel: { timeModel: "cyclical", urgency: -20 },
      spiral: { timeModel: "spiral", urgency: -10 },
      illusion: { timeModel: "eternal_now", urgency: -30 }
    }
  },
  
  // SECTION 2: ONTOLOGICAL STRUCTURE
  
  q4: {
    id: "good_evil_nature",
    section: "Ontological Structure",
    text: "Good and evil are...",
    type: "single",
    options: [
      { value: "eternal_forces", text: "Two eternal opposing forces", next: "q5" },
      { value: "aspects", text: "Different aspects of one reality", next: "q6" },
      { value: "constructs", text: "Human constructs", next: "q6" },
      { value: "hierarchy", text: "Stages in a hierarchy (evil = less developed good)", next: "q6" }
    ],
    scores: {
      eternal_forces: { ontology: "dualist", zeroSum: 40 },
      aspects: { ontology: "monist", zeroSum: -20 },
      constructs: { ontology: "relativist", zeroSum: 10 },
      hierarchy: { ontology: "hierarchical_monist", zeroSum: -10 }
    }
  },
  
  q5: {
    id: "dualism_outcome",
    section: "Ontological Structure",
    text: "How will the battle between good and evil end?",
    type: "single",
    condition: (prev) => prev.q4 === "eternal_forces",
    options: [
      { value: "good_wins", text: "Good will ultimately triumph", next: "q7" },
      { value: "eternal_battle", text: "The battle will continue forever", next: "q7" },
      { value: "separation", text: "They will be permanently separated", next: "q7" },
      { value: "unsure", text: "I don't know", next: "q7" }
    ],
    scores: {
      good_wins: { urgency: 20, goalOriented: 30 },
      eternal_battle: { urgency: -10, goalOriented: -20 },
      separation: { urgency: 10, goalOriented: 20 },
      unsure: { urgency: 0 }
    }
  },
  
  q6: {
    id: "unity_recognition",
    section: "Ontological Structure",
    text: "If all is one, why does separation seem so real?",
    type: "single",
    condition: (prev) => prev.q4 === "aspects" || prev.q4 === "hierarchy",
    options: [
      { value: "ignorance", text: "Due to ignorance/forgetting", next: "q7" },
      { value: "play", text: "It's part of the cosmic play/game", next: "q7" },
      { value: "evolution", text: "Necessary for growth and evolution", next: "q7" },
      { value: "not_one", text: "Actually, I don't think all is one", next: "q7" }
    ],
    scores: {
      ignorance: { goalOriented: 20, worldValue: -10 },
      play: { goalOriented: -20, worldValue: 20 },
      evolution: { goalOriented: 10, worldValue: 10 },
      not_one: { ontology: "pluralist" }
    }
  },
  
  // SECTION 3: MATERIAL WORLD VALUATION
  
  q7: {
    id: "physical_world",
    section: "Material World",
    text: "The physical/material world is...",
    type: "single",
    options: [
      { value: "good", text: "Fundamentally good and sacred", next: "q8" },
      { value: "neutral", text: "A neutral tool or classroom", next: "q8" },
      { value: "illusion", text: "An illusion to see through", next: "q8" },
      { value: "prison", text: "A prison or trap for consciousness", next: "q9" }
    ],
    scores: {
      good: { worldValue: 40 },
      neutral: { worldValue: 10 },
      illusion: { worldValue: -20 },
      prison: { worldValue: -40, urgency: 20 }
    }
  },
  
  q8: {
    id: "world_engagement",
    section: "Material World",
    text: "How should we engage with the material world?",
    type: "single",
    condition: (prev) => prev.q7 !== "prison",
    options: [
      { value: "fully", text: "Fully and joyfully participate", next: "q10" },
      { value: "mindfully", text: "Engage mindfully without attachment", next: "q10" },
      { value: "minimally", text: "Minimize engagement, focus on spiritual", next: "q10" },
      { value: "transform", text: "Transform it through our actions", next: "q10" }
    ],
    scores: {
      fully: { worldValue: 20 },
      mindfully: { worldValue: 0 },
      minimally: { worldValue: -20, urgency: 10 },
      transform: { goalOriented: 20 }
    }
  },
  
  q9: {
    id: "escape_urgency",
    section: "Material World",
    text: "How urgent is escaping the material world?",
    type: "single",
    condition: (prev) => prev.q7 === "prison",
    options: [
      { value: "critical", text: "Critical - time is limited", next: "q10" },
      { value: "important", text: "Important but gradual process is okay", next: "q10" },
      { value: "eventual", text: "It will happen eventually across many lifetimes", next: "q10" },
      { value: "rethinking", text: "Maybe it's not actually a prison...", next: "q10" }
    ],
    scores: {
      critical: { urgency: 40 },
      important: { urgency: 20 },
      eventual: { urgency: -10 },
      rethinking: { worldValue: 20, urgency: -10 }
    }
  },
  
  // SECTION 4: GOAL ORIENTATION & PURPOSE
  
  q10: {
    id: "ultimate_purpose",
    section: "Purpose & Goals",
    text: "What is the ultimate purpose of existence?",
    type: "single",
    options: [
      { value: "specific_goal", text: "Reaching a specific goal (salvation, enlightenment, etc.)", next: "q11" },
      { value: "growth", text: "Continuous growth and exploration", next: "q12" },
      { value: "no_purpose", text: "There is no ultimate purpose", next: "q12" },
      { value: "create_meaning", text: "We create our own meaning", next: "q12" }
    ],
    scores: {
      specific_goal: { goalOriented: 40, urgency: 10 },
      growth: { goalOriented: 10, urgency: -10 },
      no_purpose: { goalOriented: -30 },
      create_meaning: { goalOriented: -10 }
    }
  },
  
  q11: {
    id: "goal_timeframe",
    section: "Purpose & Goals",
    text: "When must this goal be achieved?",
    type: "single",
    condition: (prev) => prev.q10 === "specific_goal",
    options: [
      { value: "this_life", text: "In this lifetime", next: "q13" },
      { value: "soon", text: "Soon (within a few generations)", next: "q13" },
      { value: "eventually", text: "Eventually, in its own time", next: "q13" },
      { value: "already_achieved", text: "It's already achieved, just need to recognize it", next: "q13" }
    ],
    scores: {
      this_life: { urgency: 30 },
      soon: { urgency: 20 },
      eventually: { urgency: -10 },
      already_achieved: { urgency: -20, goalOriented: -10 }
    }
  },
  
  q12: {
    id: "progress_direction",
    section: "Purpose & Goals",
    text: "Is humanity/consciousness moving in a direction?",
    type: "single",
    condition: (prev) => prev.q10 !== "specific_goal",
    options: [
      { value: "upward", text: "Yes, upward/forward", next: "q13" },
      { value: "cyclical", text: "In cycles (up and down)", next: "q13" },
      { value: "no_direction", text: "No particular direction", next: "q13" },
      { value: "multiple", text: "Multiple valid directions", next: "q13" }
    ],
    scores: {
      upward: { goalOriented: 20 },
      cyclical: { goalOriented: 0 },
      no_direction: { goalOriented: -20 },
      multiple: { goalOriented: -10, tribalism: -10 }
    }
  },
  
  // SECTION 5: SALVATION/ACCESS/TRIBALISM
  
  q13: {
    id: "who_saved",
    section: "Salvation & Access",
    text: "Salvation/enlightenment/fulfillment is available to...",
    type: "single",
    options: [
      { value: "everyone_equal", text: "Everyone equally", next: "q14" },
      { value: "those_who_choose", text: "Those who choose the right path", next: "q14" },
      { value: "chosen_few", text: "A chosen few", next: "q15" },
      { value: "different_paths", text: "Everyone, but through different valid paths", next: "q14" }
    ],
    scores: {
      everyone_equal: { tribalism: -30 },
      those_who_choose: { tribalism: 20 },
      chosen_few: { tribalism: 40 },
      different_paths: { tribalism: -20 }
    }
  },
  
  q14: {
    id: "outsider_status",
    section: "Salvation & Access",
    text: "People who believe very differently from you are...",
    type: "single",
    condition: (prev) => prev.q13 !== "chosen_few",
    options: [
      { value: "equally_valid", text: "On an equally valid path", next: "q16" },
      { value: "misguided", text: "Misguided but can be helped", next: "q16" },
      { value: "lost", text: "Lost and in danger", next: "q16" },
      { value: "different_stage", text: "At a different stage of the journey", next: "q16" }
    ],
    scores: {
      equally_valid: { tribalism: -20 },
      misguided: { tribalism: 10 },
      lost: { tribalism: 30, urgency: 10 },
      different_stage: { tribalism: 0 }
    }
  },
  
  q15: {
    id: "chosen_criteria",
    section: "Salvation & Access",
    text: "What makes someone part of the 'chosen'?",
    type: "single",
    condition: (prev) => prev.q13 === "chosen_few",
    options: [
      { value: "born_into", text: "Being born into the right group", next: "q16" },
      { value: "initiated", text: "Proper initiation/conversion", next: "q16" },
      { value: "gnosis", text: "Receiving special knowledge", next: "q16" },
      { value: "rethinking", text: "Actually, maybe everyone can access it...", next: "q16" }
    ],
    scores: {
      born_into: { tribalism: 30 },
      initiated: { tribalism: 20 },
      gnosis: { tribalism: 10 },
      rethinking: { tribalism: -20 }
    }
  },
  
  // SECTION 6: COMPETITION VS. COOPERATION
  
  q16: {
    id: "zero_sum",
    section: "Competition & Cooperation",
    text: "In life, for someone to win...",
    type: "single",
    options: [
      { value: "must_lose", text: "Someone else must lose (fixed pie)", next: "q17" },
      { value: "everyone_wins", text: "Everyone can win together (growing pie)", next: "q17" },
      { value: "depends", text: "Depends on the situation", next: "q17" }
    ],
    scores: {
      must_lose: { zeroSum: 40 },
      everyone_wins: { zeroSum: -30 },
      depends: { zeroSum: 0 }
    }
  },
  
  q17: {
    id: "resource_scarcity",
    section: "Competition & Cooperation",
    text: "When resources are scarce, the best strategy is to...",
    type: "single",
    options: [
      { value: "hoard", text: "Secure what you need first", next: "q18" },
      { value: "share", text: "Share so everyone survives", next: "q18" },
      { value: "compete", text: "Compete fairly for them", next: "q18" },
      { value: "cooperate", text: "Cooperate to create more", next: "q18" }
    ],
    scores: {
      hoard: { zeroSum: 20, urgency: 10 },
      share: { zeroSum: -20 },
      compete: { zeroSum: 10 },
      cooperate: { zeroSum: -30 }
    }
  },
  
  // SECTION 7: FORGIVENESS & RETALIATION
  
  q18: {
    id: "betrayal_response",
    section: "Forgiveness & Justice",
    text: "If someone betrays your trust, you should...",
    type: "single",
    options: [
      { value: "never_trust", text: "Never trust them again", next: "q19" },
      { value: "cautious", text: "Be cautious but give one more chance", next: "q19" },
      { value: "forgive", text: "Forgive and trust again fully", next: "q19" },
      { value: "understand", text: "Understand why they did it and respond accordingly", next: "q19" }
    ],
    scores: {
      never_trust: { forgivenessOrientation: -30 },
      cautious: { forgivenessOrientation: 10 },
      forgive: { forgivenessOrientation: 40 },
      understand: { forgivenessOrientation: 20 }
    }
  },
  
  q19: {
    id: "justice_vs_mercy",
    section: "Forgiveness & Justice",
    text: "What's more important: justice or mercy?",
    type: "single",
    options: [
      { value: "justice", text: "Justice - actions must have consequences", next: "q20" },
      { value: "mercy", text: "Mercy - compassion above all", next: "q20" },
      { value: "balance", text: "Balance between both", next: "q20" },
      { value: "neither", text: "Neither - just understanding and growth", next: "q20" }
    ],
    scores: {
      justice: { forgivenessOrientation: -20 },
      mercy: { forgivenessOrientation: 30 },
      balance: { forgivenessOrientation: 10 },
      neither: { forgivenessOrientation: 20, goalOriented: -10 }
    }
  },
  
  // SECTION 8: FINAL CALIBRATION
  
  q20: {
    id: "personal_urgency",
    section: "Personal Urgency",
    text: "How would you describe your sense of urgency about life's purpose?",
    type: "slider",
    min: 0,
    max: 100,
    labels: {
      0: "No rush - eternity awaits",
      50: "Balanced urgency",
      100: "Time is running out!"
    },
    scores: (value) => ({ urgency: value - 50 })
  }
};

// Helper function to get next question based on conditions
export function getNextQuestion(currentId, answers) {
  const current = QUESTIONNAIRE[currentId];
  
  if (current.type === 'single') {
    const selectedOption = current.options.find(opt => opt.value === answers[currentId]);
    return selectedOption ? selectedOption.next : null;
  } else if (current.type === 'slider') {
    // Sliders always proceed to next question (in this case, end of questionnaire)
    return null;
  }
  
  return null;
}

// Helper function to check if question should be shown
export function shouldShowQuestion(questionId, answers) {
  const question = QUESTIONNAIRE[questionId];
  
  if (!question.condition) {
    return true;
  }
  
  return question.condition(answers);
}
