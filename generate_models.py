import re

data = """
### 1. NVIDIA Models

* **[NVIDIA: Nemotron 3 Ultra (free)](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free)** – A 550B total parameter hybrid MoE architecture built for complex agentic workflows and multi-step orchestration (1M context).
* **[NVIDIA: Nemotron 3 Super (free)](https://openrouter.ai/nvidia/nemotron-3-super-120b-a12b:free)** – A 120B parameter hybrid Mamba-Transformer MoE optimized for cross-document reasoning and multi-agent systems (1M context).
* **[NVIDIA: Nemotron 3.5 Content Safety (free)](https://openrouter.ai/nvidia/nemotron-3.5-content-safety:free)** – A compact 4B parameter multimodal guardrail model fine-tuned from Gemma-3 for prompt/response filtering.
* **[NVIDIA: Nemotron 3 Nano Omni (free)](https://openrouter.ai/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free)** – A 30B open multimodal perception sub-agent accepting text, image, video, and audio inputs.
* **[NVIDIA: Nemotron 3 Nano 30B A3B (free)](https://openrouter.ai/nvidia/nemotron-3-nano-30b-a3b:free)** – A privacy-focused open-weight MoE designed for specialized local agent architecture.
* **[NVIDIA: Nemotron Nano 12B 2 VL (free)](https://openrouter.ai/nvidia/nemotron-nano-12b-v2-vl:free)** – A 12B parameter multimodal reasoning model optimized for document intelligence and video understanding.
* **[NVIDIA: Nemotron Nano 9B V2 (free)](https://openrouter.ai/nvidia/nemotron-nano-9b-v2:free)** – A unified 9B model that defaults to structured reasoning traces before providing final answers.

### 2. OpenAI & Meta Models

* **[OpenAI: gpt-oss-120b (free)](https://openrouter.ai/openai/gpt-oss-120b:free)** – An open-weight 117B parameter MoE built for high-reasoning tasks and structured output generation.
* **[OpenAI: gpt-oss-20b (free)](https://openrouter.ai/openai/gpt-oss-20b:free)** – A low-latency 21B MoE model optimized for single-GPU enterprise or local deployments.
* **[Meta: Llama 3.3 70B Instruct (free)](https://openrouter.ai/meta-llama/llama-3.3-70b-instruct:free)** – Multilingual dialogue model optimized for reasoning, code assistance, and general instruction following.
* **[Meta: Llama 3.2 3B Instruct (free)](https://openrouter.ai/meta-llama/llama-3.2-3b-instruct:free)** – Highly efficient, lightweight multilingual edge model optimized for summarization and fast tasks.

### 3. Google & Qwen Models

* **[Google: Gemma 4 26B A4B (free)](https://openrouter.ai/google/gemma-4-26b-a4b-it:free)** – Google DeepMind's efficient MoE instruction-tuned model for text, images, and video.
* **[Google: Gemma 4 31B (free)](https://openrouter.ai/google/gemma-4-31b-it:free)** – A dense 30.7B parameter multimodal model featuring a togglable thinking mode.
* **[Qwen: Qwen3 Next 80B A3B Instruct (free)](https://openrouter.ai/qwen/qwen3-next-80b-a3b-instruct:free)** – Optimized for production throughput, tool calls, and steady RAG pipelines without exposing visible CoT.
* **[Qwen: Qwen3 Coder 480B A35B (free)](https://openrouter.ai/qwen/qwen3-coder:free)** – Massive open MoE fine-tuned explicitly for codebase reasoning and multi-file software engineering.

### 4. Poolside & LiquidAI Models

* **[Poolside: Laguna XS.2 (free)](https://openrouter.ai/poolside/laguna-xs.2:free)** – Second-generation lightweight developer companion optimized for fast syntax corrections and reasoning.
* **[Poolside: Laguna M.1 (free)](https://openrouter.ai/poolside/laguna-m.1:free)** – Flagship coding agent designed to parse complex logic and interact cleanly with programming tools.
* **[LiquidAI: LFM2.5-1.2B-Thinking (free)](https://openrouter.ai/liquid/lfm-2.5-1.2b-thinking:free)** – Lightweight on-device architecture with extended thinking capabilities for data extraction and RAG.
* **[LiquidAI: LFM2.5-1.2B-Instruct (free)](https://openrouter.ai/liquid/lfm-2.5-1.2b-instruct:free)** – Fast, instruction-aligned edge framework for conversational assistance.

### 5. Specialized, Open & Base Routers

* **[Nex AGI: Nex-N2-Pro (free)](https://openrouter.ai/nex-agi/nex-n2-pro:free)** – A 302B token agentic MoE model mapping planning, code debugging, and tool loops on top of Qwen3.5.
* **[Venice: Uncensored (free)](https://openrouter.ai/venice/uncensored:free)** – A 24B Mistral-based fine-tune developed to preserve steerability without mainstream safety/alignment layers.
* **[Nous: Hermes 3 405B Instruct (free)](https://openrouter.ai/nousresearch/hermes-3-llama-3.1-405b:free)** – Frontier-level full parameter fine-tune of Llama 3.1 405B focusing on extreme user roleplay and advanced agent alignment.
* **[OpenRouter: free](https://openrouter.ai/openrouter/free)** – An automated auto-routing endpoint that analyzes your request constraints (like tools or images) and distributes traffic dynamically among active free providers.
"""

models = []
current_provider = "openrouter"

for line in data.split('\n'):
    line = line.strip()
    if line.startswith('### 1. NVIDIA Models'):
        current_provider = 'nvidia'
    elif line.startswith('### 2.'):
        current_provider = 'openrouter'
    
    if line.startswith('* **['):
        match = re.search(r'\* \*\*\[(.*?)\]\((.*?)\)\*\* – (.*)', line)
        if match:
            name_raw = match.group(1)
            url = match.group(2)
            desc = match.group(3)
            
            # Extract id from url (e.g., https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free)
            # Remove https://openrouter.ai/
            id_part = url.replace('https://openrouter.ai/', '')
            
            # Remove (free) from name
            name = name_raw.replace(' (free)', '')
            
            # Extract strength
            strength = "General"
            if "reasoning" in desc.lower(): strength = "Reasoning"
            elif "coding" in desc.lower(): strength = "Coding"
            elif "agent" in desc.lower(): strength = "Agentic"
            elif "multimodal" in desc.lower(): strength = "Multimodal"
            elif "vision" in desc.lower(): strength = "Vision"
            elif "routing" in desc.lower(): strength = "Auto-Routing"
            
            model = {
                'id': id_part,
                'name': name,
                'provider': current_provider,
                'description': desc,
                'status': 'free',
                'strengths': [strength]
            }
            models.append(model)

import json
print(json.dumps(models, indent=2))
