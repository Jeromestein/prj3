const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');

const DEFAULT_AUTHOR = {
  name: 'Modern AI Research Team',
  email: 'ai-editor@modernblog.com',
  password: 'ChangeMe123!',
  roles: ['editor'],
};

const seedPosts = [
  {
    slug: 'anthropic-universal-skills',
    title: 'Anthropic Skills: Building Universal AI Tools',
    topic: 'AI Platforms',
    excerpt:
      "A deep dive into Anthropic's new Skills framework and what universal, re-usable AI workflows mean for builders.",
    readTime: '9 min read',
    createdAt: new Date('2024-09-19T10:00:00.000Z'),
    content: [
      '# Why Anthropic Skills Matter',
      '',
      "Anthropic's Skills announcement introduces modular capabilities that teams can wire together to build trustworthy agents. Each Skill encapsulates a permissioned behavior, from research to code review, and can be shared across products.",
      '',
      '## Modular safety guardrails',
      '',
      "Skills inherit Anthropic's safety policies, meaning every workflow automatically benefits from context filtering, red-teaming, and policy updates. That frees startups from reinventing compliance baselines.",
      '',
      '## Composable workflows',
      '',
      'Product squads can stack Skills to orchestrate complex pipelines: imagine pairing *Research Synthesizer* with *Policy Checker* and a *Code Reviewer* Skill to ship governance-friendly releases in hours.',
      '',
      '## Getting started',
      '',
      '1. Review the [Skills launch post](https://www.anthropic.com/news/skills) for current modules.',
      '2. Map repeatable tasks in your org - anything that requires consistent judgement is a candidate.',
      '3. Use the sandbox environment to connect Skills and monitor telemetry before going live.',
      '',
      '> The future of AI platforms is collaborative. Skills offer a blueprint for sharing capabilities without sacrificing oversight.',
    ].join('\n'),
  },
  {
    slug: 'chatgpt-atlas-product-tour',
    title: 'Navigating ChatGPT Atlas for Production Teams',
    topic: 'AI Operations',
    excerpt:
      "We road-test OpenAI's ChatGPT Atlas, exploring how product and data teams can catalog prompts, governance, and telemetry in one hub.",
    readTime: '8 min read',
    createdAt: new Date('2024-08-28T12:30:00.000Z'),
    content: [
      '# Atlas as your AI control center',
      '',
      'ChatGPT Atlas ships with dashboards for prompt governance, usage analytics, and change tracking. For organizations graduating from experimental chatbots, Atlas centralizes the operational heartbeat.',
      '',
      '## Versioning prompts the right way',
      '',
      'Atlas treats prompts like code. You can tag releases, compare diffed changes, and roll back to stable versions when experiments go sideways. That alone can save product squads from late-night incident bridges.',
      '',
      '## Observability baked in',
      '',
      'The insight panels reveal latency hotspots, cost breakdowns by workspace, and content category drift. Pair it with usage alerts to spot anomalies before stakeholders do.',
      '',
      '## Rollout checklist',
      '',
      '- Assign workspace owners and reviewers.',
      '- Connect Atlas to your identity provider for audit trails.',
      '- Establish SLAs for model updates and communicate them in Atlas announcements.',
      '',
      'Atlas turns reactive firefighting into proactive governance - exactly what enterprises need as AI workloads scale.',
    ].join('\n'),
  },
  {
    slug: 'nano-banana-inference',
    title: 'Nano Banana: Tiny Models, Production-Grade Impact',
    topic: 'Edge AI',
    excerpt:
      'Nano Banana shows how sub-billion parameter models can unlock blazing-fast inference on commodity hardware without sacrificing quality.',
    readTime: '7 min read',
    createdAt: new Date('2024-07-15T09:15:00.000Z'),
    content: [
      '# Meet Nano Banana',
      '',
      'Nano Banana is the latest proof that small models can deliver heavyweight results. It runs comfortably on consumer GPUs and even CPU-only servers, opening AI features to teams without hyperscaler budgets.',
      '',
      '## Performance highlights',
      '',
      '- **Latency:** Under 120ms for summarization tasks on a single T4.',
      '- **Memory:** Fits inside 4 GB VRAM with room for adapters.',
      '- **Quality:** Benchmarks within 4 points of models 3x its size on common QA suites.',
      '',
      '## Deployment recipe',
      '',
      '1. Quantize weights with the bundled 4-bit toolkit.',
      '2. Host behind a lightweight FastAPI service.',
      '3. Cache warm prompts to keep tail latency predictable.',
      '',
      '## Why it matters',
      '',
      'The next wave of AI adoption will hinge on practicality. Nano Banana proves you can ship delightful experiences without rewriting your infrastructure.',
    ].join('\n'),
  },
];

const ensureSeedAuthor = async () => {
  let user = await User.findOne({ email: DEFAULT_AUTHOR.email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(DEFAULT_AUTHOR.password, 12);
    user = await User.create({
      name: DEFAULT_AUTHOR.name,
      email: DEFAULT_AUTHOR.email,
      password: hashedPassword,
      roles: DEFAULT_AUTHOR.roles,
    });
  }
  return user;
};

const ensurePost = async (postData, author) => {
  const existing = await Post.findOne({ slug: postData.slug });
  if (existing) {
    return false;
  }

  const created = await Post.create({
    ...postData,
    authorId: author._id,
    authorName: author.name,
    updatedAt: postData.createdAt,
  });

  if (postData.createdAt) {
    await Post.updateOne(
      { _id: created._id },
      { createdAt: postData.createdAt, updatedAt: postData.createdAt }
    );
  }

  return true;
};

const ensureInitialPosts = async () => {
  try {
    const author = await ensureSeedAuthor();
    let createdCount = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const post of seedPosts) {
      // eslint-disable-next-line no-await-in-loop
      const created = await ensurePost(post, author);
      if (created) {
        createdCount += 1;
      }
    }

    if (createdCount > 0) {
      console.log(`[seed] Inserted ${createdCount} initial AI posts`);
    }
  } catch (error) {
    console.error('[seed] Failed to ensure initial posts:', error.message);
  }
};

module.exports = ensureInitialPosts;
