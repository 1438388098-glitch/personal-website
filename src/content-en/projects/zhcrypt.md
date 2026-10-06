---
title: "zhcrypt: an end-to-end encryption toolkit"
summary: "End-to-end encryption for Chinese-speaking users: Argon2id derivation, AES-256-GCM authenticated encryption, RSA-4096 hybrid encryption, X3DH plus Double Ratchet forward secrecy, TOFU safety codes against man-in-the-middle, in CLI and GUI forms."
group: 工程侧证
date: 2026-09-28
featured: false
order: 2
metrics:
  - label: Unit tests
    value: '161 cases'
    detail: "Including test_security_fixes 66/66, test_x3dh_full 25/25, test_chat 18/18"
  - label: Authorized-audit fixes
    value: '9 classes'
    detail: "The 2026-08-13 audit round fixed AEAD nonce reuse, pre-shared-key identity attribution, path traversal, rate-limit bypass, the ephemeral password wordlist and more, all with regression tests"
  - label: Ephemeral password entropy
    value: '≈48 bit'
    detail: "Wordlist grown from 20 to 256 words; previously about 17.3 bit"
links:
  - label: GitHub repository
    url: https://github.com/1438388098-glitch/zhcrypt
---

## Problem and boundary

End-to-end encryption tools abound, but deployment guides and threat models are mostly English-only, and parameter choices are opaque. zhcrypt packs the modern stack (Argon2id, AES-256-GCM, RSA-4096-OAEP, X3DH plus Double Ratchet) into three forms, CLI, GUI and a self-hosted Flask/WebSocket server, with Chinese manuals and a threat-model document. Boundary: the double ratchet's post-compromise self-healing is only partially in place (cross-chain out-of-order prekey storage done, full restart resynchronization not), and the ciphertext header's Argon2id parameters are not covered by GCM AAD; these leftovers need a protocol version bump and are queued for the next major version. Production deployment must enable HTTPS/WSS with certificate pinning, and server tokens travel only via environment variables.

## Mechanism

The message layer advances session keys per message for forward secrecy; identity uses trust-on-first-use plus out-of-band safety-code comparison, and an unexpected change in the signed public key refuses the session; optional SPKI pinning guards against sloppy CAs. The nine audit fixes each map to a concrete scenario: one-time pre-shared-key batch wrapping moved to independent nonces (the original key-plus-nonce reuse triggered GCM keystream reuse), the server now refuses to silently overwrite someone else's signed public key (blocking pre-shared-key poisoning impersonation), streaming decryption output names are basename-sanitized, Argon2id memory × parallelism clamps at 2GiB against DoS, rate-limit keys switched to the unfakeable X-Real-IP, the ephemeral password wordlist grew from 20 to 256 words (about 17.3 bit up to about 48 bit), double-ratchet message-number jumps are clamped, local key files are encrypted at rest with private keys at 0600, and all-zero X25519 shared secrets are refused. Builds carry dependency locks, an SBOM and SHA256 manifests.

## Verification

Correctness is held by regression tests and attacker-view self-testing, all materials public in the repository. The 2026-08-13 authorized-audit fixes carry a full regression set: test_all 38/38, test_security_fixes 66/66, test_x3dh_full 25/25, test_chat 18/18, with 161 unit tests passing in total. The 3.2.0 batch (15 automated iteration rounds) lists its verification in the release notes: the pytest collection 300+ all passing, TUI smoke plus login screen 44+31 all passing, local two-endpoint E2E against a real server process 13/13, packaging checks (PyInstaller rebuild, exe-level encrypt/decrypt round trip, GUI liveness) all passing, and pip-audit across both dependency locks reporting 0 known vulnerabilities. Fixes touching random bytes, the filesystem or threads require three full pytest runs before merge (executed 2026-09-11, three times exit=0), and the repository's TODO/FIXME count is 0. The earlier red-team self-test report took the attacker's view: it demonstrated breaking auth-token plaintext-on-disk and WS-without-certificate-validation, and after the fixes the security regression suite grew from 46 to 66 items, all green. Builds are reproducible: requirements.lock.txt pins dependencies, and artifacts carry SBOM.json, buildinfo.json and SHA256SUMS.txt.

## Known failures

Protocol-level leftovers need a version bump and are queued for the next major release: Double Ratchet post-compromise self-healing is only partial (cross-chain out-of-order prekey storage done, full restart resync not); the ciphertext header's Argon2id parameters are outside GCM AAD, so streaming header fields go unauthenticated and only parameter clamping backstops them; HKDF uses a fixed salt; Shamir secret sharing uses the secp256k1 prime rather than a standard safe prime; and X3DH has no explicit AD binding, leaving a theoretical UKS surface mitigated by out-of-band safety-number comparison. Engineering debts too: fileclient buffers downloads whole, peaking in memory near the 2GB cap, with streaming still unimplemented; and the GUI chat's legacy file-transfer pipeline coexists with send_file, not yet merged. On compatibility: 3.2.0's file-password mode defaults to the streaming format (0x05), which 3.1.0 cannot decrypt, so upgrades must sync both ends. Deployment duties cannot be done by code: production must actually enable HTTPS/WSS with certificate pinning and keep tokens in environment variables, because without setting ZHPREKEY_TRUST_PROXY=0, a direct 5000 connection lets a forged X-Real-IP bypass rate limiting. Miss any of these steps and the end-to-end guarantee shrinks accordingly.
