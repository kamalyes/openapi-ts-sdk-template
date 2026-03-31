# ============================================================================
# 依赖更新 | Dependency updates
#
# 开发依赖合成一个 PR，避免每周被十几个单独 PR 淹没；
# GitHub Actions 的版本按月检查就够了
#
# Dev dependencies are grouped into a single PR instead of a dozen weekly ones;
# monthly checks are enough for GitHub Actions versions.
# ============================================================================

version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
    groups:
      dev-dependencies:
        dependency-type: development

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: monthly
