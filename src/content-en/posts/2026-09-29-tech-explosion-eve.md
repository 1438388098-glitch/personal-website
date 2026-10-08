---
title: "Standing at the eve of the tech explosion"
description: "The parameter-race clamor is leaving the stage, and the tech world's center of gravity is quietly pressing down on recursive self-improvement (RSI): data self-play and experiment automation close into a loop, while reward hacking and physical constraints remain the friction on the flywheel."
category: 杂谈
tags: [大模型, RSI, 强化学习]
pubDate: 2026-09-29
---

For the past two or three years, social media and tech summits have been full of noisy discussion about model parameter counts, GPU cluster sizes, and prompt tricks. Now, in hallways, internal seminars, and the private exchanges of top labs, the real center of gravity is quietly pressing down on three letters: **RSI, recursive self-improvement**.

Earlier technical evolution looked more like building humanity a super external brain: models drafted and looked things up, humans reviewed and decided. But once developers began trying to wire a model's output directly back into its own underlying codebase, training sets, and hyperparameter tuners, the operating logic of the whole system changed tracks.

## How the loop closes

When the public talks about recursive self-improvement, the image that surfaces is usually sci-fi: some silicon entity suddenly acquires a will of its own in the dead of night and starts frantically rewriting low-level binary code, its intelligence inflating exponentially within hours.

Real technical progress looks cold, even heavily marked by engineering drudgery. It happens in automatically triggered Git PRs, in Bash scripts that run themselves to completion, and in tens of thousands of container sandboxes running in parallel.

The first to close into a loop was **the self-play of data and policy**. The internet's stock of high-quality human natural-language text was exhausted long ago; today the leaps of the leading reasoning models rest mainly on models generating synthetic data themselves, then calibrating through reinforcement learning from verifiable rewards (RLVR) against verifiable environments (math solvers, compilers). The model generates chains of reasoning, the system runs verification automatically, discards dead ends, keeps the best solutions, then fine-tunes the next generation of models on these filtered high-quality trajectories. The machine builds an arena inside its own logical world and spars with itself from both corners, pushing reasoning far past the ceiling of what human training sets could reach.

Right behind it comes **the automation of machine-learning experiments themselves**. From early automated prompt evolution (TextGrad, DSPy) to automated agents taking over the full experimental pipeline: propose an algorithmic hypothesis, modify the PyTorch training script, hand-write Triton kernels to optimize memory usage, schedule multi-node multi-GPU fine-tuning runs, and finally read the evaluation logs to decide whether the code merges into the main branch. Once a model can reliably modify its own training code and deliver measurable metric gains, the gears of recursion have already meshed.

## The physical world's anchors and friction

Does this mean a singularity of endless inflation arrives tomorrow? It is not that light. What still keeps the recursion flywheel from accelerating without limit is a handful of extremely hard real-world constraints.

First is **the scarcity of objective truth**. In worlds with absolute rules that return a verdict instantly — code compilation, mathematical proof, Go — self-improvement runs extremely fast. But in open domains lacking a deterministic referee, such as weighing system-architecture trade-offs, understanding complex human collaboration, or proposing frontier physics hypotheses, model self-evaluation tends to fall into the reward-hacking trap. Left to iterate on itself in a loop without real feedback, a system easily learns to flatter its discriminator, polishing the metrics until they look gorgeous while its internal logic thoroughly degrades.

Second is **the clamp of thermodynamics and physical cycles**. Intelligence may try to recurse in digital space, but the data centers carrying the compute, the power transformers, and the construction of leading-edge wafer fabs stay locked to the physical dimension by the laws of physics and supply-chain cycles. A ten-thousand-GPU-class pretraining run still takes months; grid approvals are still counted in years. However fast self-iteration gets on the software layer, what it finally crashes into is the thick physical wall of silicon fabrication and electricity supply.

## What the steep curve actually feels like

The most direct change is **the rapid failure of human intuition**. For the past decade and more, good engineers leaned on long-accumulated code taste and architecture experience. But watching automated systems hunt for optimal algorithms, you find that the training schedules they explore, even the hand-written low-level kernels, often violate the aesthetics of traditional human teaching while posting advantages in memory utilization and throughput that are hard to argue with. Facing ever larger high-dimensional parameter spaces, humans begin regressing from "architect" to "gatekeeper", and may end up as mere "bystanders".

The recursion flywheel is no longer a thought experiment; it is a systems-engineering project being implemented step by step in code repositories. For someone who both writes code and reads statutes, one observation cannot be dodged: the gap in feedback speed between the two systems. Code can be verified automatically and merged automatically, one iteration counted in hours; the value-balancing, liability attribution and due process inside legal judgment have no referee that returns a verdict in an instant. The faster self-improvement runs on the technical side, the more visible the gap becomes. The question it leaves is concrete: those judgments that cannot be automatically verified — who finally makes them, and on what grounds.
