"""Small OpenAI-compatible client used only for explicit reply drafting.

CSV classification deliberately does not call this client. The local Ollama
model is invoked only after a support agent clicks the draft action.
"""
from __future__ import annotations

import re
import httpx

from .config import Settings


class LLMClient:
    def __init__(self, settings: Settings) -> None:
        if not settings.llm_base_url:
            raise ValueError("LLM_BASE_URL is not configured")
        self._url = settings.llm_base_url.rstrip("/") + "/chat/completions"
        self._model = settings.llm_model
        self._headers = {"Content-Type": "application/json"}
        if settings.llm_api_key:
            self._headers["Authorization"] = f"Bearer {settings.llm_api_key}"
        self._timeout = httpx.Timeout(settings.llm_timeout_seconds, connect=5.0)

    def complete_text(self, prompt: str, system_prompt: str | None = None) -> str:
        payload = {
            "model": self._model,
            "temperature": 0.2,
            "max_tokens": 220,
            "stream": False,
            "messages": ([{"role": "system", "content": system_prompt}] if system_prompt else [])
            + [{"role": "user", "content": prompt}],
        }
        with httpx.Client(timeout=self._timeout) as client:
            response = client.post(self._url, json=payload, headers=self._headers)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
        # Some Qwen variants include a private reasoning block in their output.
        # Never show that block in the support-agent editor.
        content = re.sub(r"<think>.*?</think>", "", str(content), flags=re.I | re.S)
        content = re.sub(r"^```(?:text|markdown)?\s*|\s*```$", "", content.strip(), flags=re.I)
        return content.strip()
