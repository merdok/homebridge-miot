# Repository Guidelines

## Project Structure & Module Organization

This is a CommonJS Homebridge plugin. The entry point is `index.js`, which registers the `miot` platform. Core runtime code lives in `lib/`: `protocol/` handles MIOT communication, `factories/` resolves device implementations, `base/` and `services/` provide shared behavior, and `modules/<device-type>/` contains accessory/device classes. Dedicated model support belongs in `lib/modules/<device-type>/devices/<model>.js`, using the exact MIOT model name, for example `zhimi.airpurifier.v6.js`. CLI commands are in `cli/commands/`, Homebridge UI assets are in `homebridge-ui/`, and user-facing documentation is in `README.md`, `docs/`, `supported_devices.md`, and `config.schema.json`.

## Build, Test, and Development Commands

- `npm install`: install runtime dependencies.
- `npm link`: expose the local `miot` binary globally for manual CLI testing.
- `node cli/index.js test <ip> --token <token>`: validate local device connectivity without installing the binary.
- `miot cloud-devices -u <username> -p <password>`: list MiCloud devices and tokens when working through an installed or linked CLI.

There is no checked-in build step or npm script suite. Validate plugin changes by running Homebridge locally with debug logging and by exercising affected CLI/device paths.

## Coding Style & Naming Conventions

Use plain CommonJS: `require(...)`, `module.exports`, classes, and async methods. Keep two-space indentation, semicolons, and the existing section-comment style inside device classes. Use `PascalCase` for classes (`LightDevice`), `camelCase` for methods/properties, and uppercase constants in `lib/constants/`. Device module filenames must match MIOT model identifiers exactly because `DeviceFactory` loads them dynamically.

## Testing Guidelines

No automated test framework is currently configured. For behavior changes, perform focused manual verification: CLI connection tests for protocol changes, Homebridge debug runs for accessory/service changes, and MiCloud commands for cloud-session changes. Include the model, device type, command used, and relevant debug output in your PR notes. When adding device support, update `supported_devices.md` and any relevant docs/schema entries.

## Commit & Pull Request Guidelines

Recent history uses short, imperative or descriptive messages such as `Add xiami mi smart kettle pro 2 support (#736)`, `Updated supported_devices.md`, and `Version 1.8.7`. Keep commits focused and mention the affected device/model when applicable. PRs should describe the change, link issues, include config snippets or screenshots for UI/config work, and attach debug logs with `deepDebugLog` enabled for bug fixes.

## Security & Configuration Tips

Never commit real device tokens, MiCloud credentials, IP addresses from private networks tied to users, or cached session files. Use redacted examples in docs and PRs, and prefer local test config outside the repository.
