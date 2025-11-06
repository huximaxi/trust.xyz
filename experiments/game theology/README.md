# Cosmology & Cooperation Game

An interactive game theory experiment exploring how metaphysical beliefs shape strategic cooperation and trust.

## Overview

This project combines:
- **Belief System Profiling**: A questionnaire that maps users' cosmological beliefs
- **Game Theory Mechanics**: An iterated Prisoner's Dilemma trust game
- **Behavioral Analysis**: Algorithms detecting cognitive biases based on play patterns
- **Educational Reports**: Personalized insights connecting beliefs to strategic behavior

Inspired by:
- Robert Axelrod's "The Evolution of Cooperation"
- Kashmir Shaivism's eternal play cosmology
- Hermetic philosophy
- Gnostic finite-game theology
- Chaos Magic pragmatism

## Quick Start

### Local Setup

1. Clone or download all files to a directory
2. Open `index.html` in a modern web browser
3. No build process or dependencies required!

### File Structure

```
cosmology-cooperation/
├── index.html              # Main game interface
├── styles.css              # Minimal styling
├── questionnaire-data.js   # 20 belief-probing questions
├── scoring-algorithms.js   # Analysis and bias detection
├── game-logic.js          # Trust game mechanics
└── README.md              # This file
```

## How It Works

### Phase 1: Belief Profiling

Users answer 20 questions across 8 dimensions:

1. **Temporal Cosmology**: Finite vs. infinite time
2. **Ontological Structure**: Dualism vs. monism
3. **Material World Valuation**: Prison vs. sacred
4. **Goal Orientation**: Specific endpoint vs. endless play
5. **Salvation Access**: Universal vs. tribal
6. **Competition Mindset**: Zero-sum vs. non-zero-sum
7. **Forgiveness Orientation**: Retributive vs. restorative
8. **Personal Urgency**: Apocalyptic vs. eternal patience

The algorithm derives:
- Belief profile scores (0-100 scales)
- Cosmological type (Gnostic, Shaivite, Christian, etc.)
- Strategic archetype (Apocalyptic Defector, Infinite Player, etc.)

### Phase 2: Trust Game

An iterated Prisoner's Dilemma with ~20-30 rounds featuring:

**Base Scenarios:**
- Foundation Round (Tit-for-Tat opponent)
- Temptation Round (Always cooperate opponent)
- Betrayal Round (Sudden defection)
- Uncertain Future (Recovery test)

**Personalized Scenarios** (based on beliefs):
- Announced Last Round (for finite-worldview holders)
- Surprise Extra Round (tests last-round defection)
- Labeled Partners (in-group vs. out-group)
- Scarcity Conditions (urgency triggers)

**Game Framing:**
The game UI dynamically frames choices using the user's metaphors:
- Gnostics see "light particles" and "sharing gnosis"
- Shaivites see "consciousness play" and "dancing in harmony"
- Christians see "treasures" and "loving thy neighbor"

### Phase 3: Diagnostic Report

The report analyzes:

**Strategic Performance:**
- Total score vs. optimal strategies (Tit-for-Tat, Always Cooperate, Always Defect)
- Cooperation rate
- Forgiveness rate
- Exploitation rate

**Cognitive Biases Detected:**

1. **Eschatological Defection** - Defecting on "last round"
2. **Zero-Sum Exploitation** - Exploiting cooperative partners
3. **Eternal Grudge** - Never forgiving betrayals
4. **Naive Cooperation** - Never retaliating
5. **Tribal Cooperation** - In-group favoritism
6. **Scarcity Panic** - Crisis breakdown
7. **Strategic Opacity** - Inconsistent patterns

**Cosmological Matches:**
Shows how behavior aligns with theological traditions:
- Gnostic Christianity
- Kashmir Shaivism
- Mainstream Christianity
- Mahayana Buddhism
- Hermetic Philosophy
- Apocalyptic Movements

Each bias includes:
- Description of what happened
- Cosmological explanation (how beliefs shaped behavior)
- Psychological mechanism
- Real-world impact
- Game theory correction

## The Science

### Axelrod's Findings

Robert Axelrod's tournaments discovered that in iterated games:

1. **Nice strategies win** (never defect first)
2. **Forgiving strategies win** (don't hold eternal grudges)
3. **Retaliatory strategies win** (punish defection)
4. **Clear strategies win** (predictable patterns)

**Tit-for-Tat** (cooperate first, then mirror opponent) dominated because it embodies all four.

### The Cosmology Connection

**Finite-game theologies** (Gnosticism, some Christianity):
- Create "last round" problems
- Justify defection when sensing endings
- Enable zero-sum thinking

**Infinite-game theologies** (Kashmir Shaivism, Hermeticism):
- Eliminate last-round problems
- Make cooperation intrinsically stable
- Enable non-zero-sum cooperation

This experiment reveals how **metaphysics shapes microeconomics**.

## Technical Details

### Scoring Algorithm

Belief profile calculation:
```javascript
profile = {
  temporalModel: "finite" | "infinite" | "cyclical" | "uncertain",
  ontology: "dualist" | "monist" | "pluralist",
  goalOriented: 0-100,
  worldValue: -100 to 100,
  urgency: 0-100,
  tribalism: 0-100,
  zeroSum: 0-100,
  forgivenessOrientation: -100 to 100
}
```

Behavioral metrics:
```javascript
behavior = {
  cooperationRate: 0-100,
  forgivenessRate: 0-100,
  exploitationRate: 0-100,
  lastRoundDefection: boolean,
  scarcityResponse: "increase" | "maintain" | "decrease",
  labelBias: 0-100,
  strategyConsistency: 0-100,
  clarityScore: 0-100
}
```

Bias detection uses threshold-based rules:
- `lastRoundDefection && urgency > 60` → Eschatological Defection
- `exploitationRate > 40 && zeroSum > 50` → Zero-Sum Exploitation
- etc.

### Game Mechanics

Standard Prisoner's Dilemma payoffs:
- Both cooperate: 3 points each
- You defect, they cooperate: 5 points to you, 0 to them
- Both defect: 1 point each

Optimal long-term strategy: **Mutual cooperation** (3 per round)
Tempting short-term: **Exploitation** (5 once, then retaliation)

### Customization

**To add new questions:**
1. Edit `questionnaire-data.js`
2. Add question object with scores
3. Set branching logic in `next` fields

**To add new biases:**
1. Edit `detectBiases()` in `scoring-algorithms.js`
2. Add detection logic with thresholds
3. Include cosmological explanation

**To add new scenarios:**
1. Create class extending `Scenario` in `game-logic.js`
2. Implement `getOpponentMove()` and `getContext()`
3. Add to `generateScenarios()` with conditions

**To change styling:**
1. Edit CSS variables in `styles.css` `:root`
2. Modify colors, spacing, or layout

## Research Applications

This tool could generate valuable data:

**Research Questions:**
- Do finite-worldview holders defect more on last rounds?
- Are dualists less forgiving than monists?
- Does urgency predict scarcity panic?
- Can we predict real-world cooperation from metaphysics?

**Data Collection:**
Add analytics to track:
```javascript
{
  beliefProfile: {...},
  behaviorProfile: {...},
  biasesDetected: [...],
  demographics: {...} // optional
}
```

Store anonymized results for aggregate analysis.

**Potential Publications:**
- "Metaphysics and Microeconomics: How Cosmological Beliefs Predict Strategic Behavior"
- "The Last Round Problem in Religious Thought"
- "Temporal Cosmology as Predictor of Cooperation"

## Educational Use

### In Philosophy Classes
- Illustrates how abstract beliefs shape concrete actions
- Connects ancient philosophy to game theory
- Makes ontology tangible

### In Psychology Classes
- Demonstrates cognitive biases
- Shows belief-behavior links
- Explores decision-making under uncertainty

### In Economics/Game Theory
- Interactive Axelrod simulation
- Tests strategic thinking
- Reveals suboptimal patterns

### In Religious Studies
- Compares theological implications
- Shows practical effects of doctrines
- Bridges theory and practice

## Extensions & Ideas

### Multiplayer Mode
- Play against real opponents
- See if human behavior differs from AI
- Add chat to negotiate

### Advanced Mode
- More complex games (not just Prisoner's Dilemma)
- Evolving strategies
- Group dynamics (3+ players)

### Deeper Analysis
- Machine learning to predict behavior
- Personality integration (Big 5)
- Cultural variables

### Gamification
- Achievements for optimal play
- Leaderboards (most consistent, most adaptive)
- Challenge modes

### Educational Content
- Videos explaining each bias
- Interactive tutorials
- Comparison with famous strategies

## Credits & References

**Game Theory:**
- Axelrod, R. (1984). *The Evolution of Cooperation*
- Nicky Case's "The Evolution of Trust" (ncase.me/trust)

**Philosophy:**
- Kashmir Shaivism texts on *Spanda* and *Pratyabhijñā*
- Hermetic *Corpus Hermeticum* and *Kybalion*
- Gnostic texts (Nag Hammadi Library)

**Chaos Magic:**
- Peter Carroll's *Liber Null & Psychonaut*
- Phil Hine's *Condensed Chaos*

**Game Design:**
- James Carse, *Finite and Infinite Games*
- Jane McGonigal, *Reality Is Broken*

## License

This is an experimental educational tool. Feel free to:
- Use it in research (cite appropriately)
- Modify for your needs
- Share and distribute
- Build upon it

Suggested citation:
```
Cosmology & Cooperation: An Interactive Game Theory Experiment (2024)
Available at: [your-url]
```

## Contributing

Ideas for improvement:
1. More nuanced belief questions
2. Additional game scenarios
3. Better bias detection algorithms
4. More cosmological traditions
5. Accessibility improvements
6. Translations

## Contact & Feedback

This is an open experiment. If you:
- Find bugs
- Have philosophical critiques
- Want to collaborate on research
- Have questions about the methodology

[Add your contact information here]

---

**Remember:** The goal isn't to judge beliefs as "right" or "wrong" but to illuminate how they shape strategic thinking. All cosmologies have strengths and weaknesses—infinite-game thinking can be naive, finite-game thinking can be pragmatic. The game reveals trade-offs, not truths.

Play mindfully. Question everything. Cooperate wisely.
