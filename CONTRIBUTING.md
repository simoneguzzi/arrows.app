# Neo4j Arrows Contribution Guidelines

## Code of Conduct

This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

Please report unacceptable behavior to feedback@neo4j.com.

## Quickstart

To submit a quick pull request:

- Make sure there is [an issue](https://github.com/neo4j-labs/arrows.app/issues).
- Make sure you submit test cases (unit or integration tests) that validate your changes.
- Try not to amend existing test cases but create new ones dedicated to the changes you're making to the codebase.
- Try to test as locally as possible but potentially also add integration tests.
- The commit message:
  - First line is the subject with the essence of the change, add "fixes #issue"
  - In the description, add reasoning for changes.
- Make sure you provide your full name and an email address registered with your GitHub account.

NOTE: If you're a first-time contributor, make sure you have signed the [Contributor License Agreement](https://neo4j.com/developer/cla/).

## Advanced Information

### General

Try to keep the lifespan of a feature branch as short as possible. For simple bug fixes they should only be used for code review in pull requests.

On longer running feature branches, don't pull changes that were made to master in the meantime.
Instead, rebase the feature branch onto current master, sorting out issues and making sure the branch will fast-forward merge eventually.

### Change tracking

Make sure you don't send a PR without referring to an issue.

Try to resolve a issue in a single commit. I.e. don't have separate commits for the fix and the test cases.

NOTE: Avoid MERGE commits as they just tend to make it hard to understand what comes from where.
If there are multiple commits, and the PR is fine to merge online, use _Squash and Merge_ on GitHub.

Using the issue id in the summary line will allow us to keep track of commits belonging together.

### Handling pull requests

Be polite.
It might be the first time someone contributes to an open-source project so we should forgive violations to the contribution guidelines.
Use some gut feeling to find out in how far it makes sense to ask the reporter to fix stuff or just go ahead and add a polishing commit yourself.

Before we accept a non-trivial patch or pull request we will need you to [sign the Contributor License Agreement](https://neo4j.com/developer/cla/).
Signing the contributor’s agreement does not grant anyone commit rights to the main repository, but it does mean that we can accept your contributions, and you will get an author credit if we do.

If you decide to cherry-pick commits back to older branches make sure that all the infrastructure requirements are met (e.g. API changes etc).
If there are issues you can fix them directly and then use `git add -u && git cherry-pick --continue`
Build & test them locally first before pushing.

Before merging stuff back into the main branch, make sure you rebase your PR branch, so that there are no conflicts.
We generally do not allow merge commits, so a merge should always be fast-forward.
The issues IDs and the timestamps give enough tracking information already.

The simplest way to merge back a more complex pull request (with multiple commits) submitted by someone external is `curl`ing the patch into `git am`.
You can then polish it by either adding a commit or amending the provided commit and rebase interactively / squash locally.
Combine the commit messages and edit them to make sense.

Make sure you keep the original author when amending.

```
curl $PULL_REQUEST_URL.patch | git am --ignore-whitespace
```

Make sure to push changes to a PR to the original remote branch.
This will cause the pull request UI in GitHub show and link those commits.

This guideline document is based on the [spring-data guidelines](https://github.com/spring-projects/spring-data-build/blob/master/CONTRIBUTING.adoc), thanks @olivergierke.
