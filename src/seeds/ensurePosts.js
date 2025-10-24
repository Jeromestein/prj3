const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');

const DEFAULT_AUTHOR = {
  name: 'Modern AI Research Team',
  email: 'ai-editor@modernblog.com',
  password: 'ChangeMe123!',
  roles: ['editor'],
};

const REMOVED_SLUGS = ['chatgpt-atlas-product-tour', 'nano-banana-inference'];

const seedPosts = [
  {
    slug: 'anthropic-universal-skills',
    title: 'Anthropic Skills: Building Universal AI Tools',
    topic: 'Workflow Automation',
    excerpt:
      'Understand what Anthropic Skills are, how they load dynamically, and why they capture institutional workflows for Claude.',
    readTime: '10 min read',
    createdAt: new Date('2024-09-19T10:00:00.000Z'),
    content: `# What Are Anthropic Skills?

Skills are curated folders of instructions, scripts, and reference files that Claude loads on demand to perform specialized work. Instead of keeping every policy or workflow in the conversation context, Skills let teams package procedures and surface them only when they are needed.

## Availability and preview status

Skills are currently available as a feature preview for Claude Pro, Max, Team, and Enterprise plans when code execution is enabled. They are also in beta for Claude Code workflows and accessible via the API for builders using the code execution tool.

## How Skills work

Claude uses progressive disclosure to decide which Skills to apply. When you submit a task, Claude reviews the Skills available in the workspace, loads the ones that match the request, and follows the instructions or scripts inside. This prevents the context window from overflowing while still giving Claude everything it needs to complete a job accurately.

## Types of Skills

- **Anthropic Skills**: maintained by Anthropic and automatically invoked for common tasks such as advanced document creation in Excel, Word, PowerPoint, or PDF formats.
- **Custom Skills**: written by you or your organisation to encode brand guidelines, meeting note templates, automation scripts, or any domain-specific workflow your team relies on.

### Sample use cases for custom Skills

- Apply brand style guides to slides, documents, and marketing assets.
- Generate outbound communications that follow approved company templates.
- Structure meeting notes or research summaries in organisation-specific formats.
- Create tasks in issue trackers such as JIRA, Asana, or Linear with the right labels and assignees.
- Automate bespoke data analysis workflows or personal productivity rituals.

## Key benefits

- **Performance**: Claude gains specialised capabilities for document creation, data analysis, and other repeatable tasks where generic instructions fall short.
- **Knowledge capture**: Teams can package institutional knowledge and workflows so every teammate benefits.
- **Easy authoring**: Skills are written in Markdown and can optionally include executable scripts—no heavy engineering required for simple automations.

## How Skills compare to other Claude features

- **Skills vs. Projects**: Projects provide static background context scoped to a workspace. Skills are procedural and activate dynamically wherever needed.
- **Skills vs. MCP**: MCP connects Claude to external services or data sources. Skills tell Claude how to use those tools effectively. They work best together.
- **Skills vs. Custom Instructions**: Custom instructions always apply. Skills only load when relevant, making them ideal for specific workflows.

## Getting started

1. Audit the workflows where consistency matters most and outline them in plain language.
2. Capture the steps as Markdown instructions; add scripts if automation helps.
3. Upload your new Skills, enable code execution, and test them in the Skills sandbox before rolling them out to your team.

For a deeper dive, read the [official Skills documentation](https://www.anthropic.com/news/skills) and the Agent Skills guide in Claude Docs.`,
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
    existing.title = postData.title;
    existing.topic = postData.topic;
    existing.excerpt = postData.excerpt;
    existing.readTime = postData.readTime;
    existing.content = postData.content;
    existing.authorId = author._id;
    existing.authorName = author.name;

    if (postData.createdAt) {
      existing.createdAt = postData.createdAt;
    }

    existing.updatedAt = postData.createdAt || new Date();
    await existing.save();
    return { created: false, updated: true };
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

  return { created: true, updated: false };
};

const ensureInitialPosts = async () => {
  try {
    const author = await ensureSeedAuthor();
    let createdCount = 0;
    let updatedCount = 0;

    if (REMOVED_SLUGS.length > 0) {
      const removalResult = await Post.deleteMany({ slug: { $in: REMOVED_SLUGS } });
      if (removalResult.deletedCount) {
        console.log(`[seed] Removed ${removalResult.deletedCount} deprecated AI posts`);
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const post of seedPosts) {
      // eslint-disable-next-line no-await-in-loop
      const result = await ensurePost(post, author);
      if (result.created) {
        createdCount += 1;
      }
      if (result.updated) {
        updatedCount += 1;
      }
    }

    if (createdCount > 0 || updatedCount > 0) {
      console.log(
        `[seed] Synced AI posts (created: ${createdCount}, updated: ${updatedCount})`
      );
    }
  } catch (error) {
    console.error('[seed] Failed to ensure initial posts:', error.message);
  }
};

module.exports = ensureInitialPosts;
