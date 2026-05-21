# shanebrain-core Source Review Findings

## Review Policy

shanebrain-core is a private infrastructure repository with production credentials and sensitive data.
This review extracted only safe, structural, and product-level information.

## Files Intentionally Skipped (Sensitivity)

The following categories of files were NOT read and no data was extracted from them:

- `.env` files and any file containing API keys, tokens, or secrets
- `vault` entries or encrypted credential stores
- SSH configuration files and authorized_keys
- Private IP addresses and machine login names
- Weaviate collection contents that may contain personal data
- Discord bot tokens, webhook URLs
- Gmail/Google OAuth credentials
- Any file named `credentials.*`, `secrets.*`, or similar

## Safe Concepts Extracted

The following structural and architectural patterns were identified and informed the Melvin MVP design:

### Local-First Architecture
- ShaneBrain uses a local-first pattern where the Pi 5 runs all services, with no external cloud dependency for core operations
- Browser localStorage is the appropriate MVP storage layer before adding a backend
- The pattern of "run locally, sync optionally" directly informed Melvin's Phase 1 design

### MCP Service Model
- ShaneBrain exposes a 42-tool MCP server on localhost:8100
- Tool categories: knowledge, chat, RAG, social, vault, notes, drafts, security, admin, ollama, planning, health
- This pattern informs Phase 3 of the Melvin roadmap (melvin-mcp server)

### Service Health Monitoring
- ShaneBrain runs a preflight script at session start to check all services
- Services are tracked with systemd and Docker, with health endpoints
- This pattern informed Melvin's HealthPanel module

### Daily Briefing Structure
- ShaneBrain generates a morning briefing at 5 AM combining calendar, context, and system status
- Melvin's BriefingPanel follows the same structure applied to dispatch context

### Weaviate Memory Pattern
- Collections: LegacyKnowledge, Conversation, FriendProfile, DailyNote, PersonalDraft, etc.
- text2vec-transformers with MiniLM-L6-v2 for semantic search
- This pattern informs Melvin's Phase 3 memory collections

## What to Import in Phase 3

- Memory model integration (Weaviate collection schemas)
- MCP tool patterns (tool definitions, annotations)
- Daily briefing service structure
- Preflight script pattern for health checks

## What NOT to Import (Ever)

- Secrets, tokens, vault contents
- Private infrastructure details (IPs, login names, SSH configs)
- Personal/family data
- Discord webhook URLs, Gmail credentials
