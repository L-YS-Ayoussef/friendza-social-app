# Friendza

![Friendza Logo](./demo/frienza-mark.png)

A modern social media app with posts, stories, profiles, and real-time-style interactions—built with a React Native (CLI) mobile client and a Node.js/Express + PostgreSQL backend.

---

## Description

Friendza provides a familiar social experience where users can create and share media (images/videos), interact through likes, comments, saves, and follows, and publish stories that expire after 24 hours. The app supports light/dark themes, English/Arabic language switching with RTL layout, profile privacy, and streamlined navigation via a drawer + stack flow.

---

## Features

### Authentication & Accounts
- **Sign up / Log in**
  - Create an account and authenticate using the backend.
- **Profile setup**
  - User profile includes avatar, name, username, bio, and account privacy.

### Feed & Posts
- **Home feed**
  - Displays a scrolling feed of posts from relevant users.
  - Pull-to-refresh updates stories and feed items.
- **Create post (image/video)**
  - Upload from gallery or capture via camera.
  - Optional **caption** and **location**.
- **Edit post (time-limited)**
  - Owners can edit a post **within 1 hour** of creation (caption/location and optionally media).
- **Delete post**
  - Owners can delete their post from the actions sheet.
- **Post actions sheet (bottom sheet)**
  - Opens from the “⋯” menu (and long-press in profile grid):
    - **Owner:** View, Edit (within 1 hour), Add to Story, Delete
    - **Non-owner:** Follow/Unfollow, Save/Unsave, View
  - Shows loading indicators during network actions and confirmation toasts for follow/save/delete actions.
- **Post viewer**
  - Displays the post and a comment list beneath it.

### Likes, Saves, Comments
- **Like / Unlike**
  - Like state updates and count changes are reflected in the UI.
- **Likes list screen**
  - Tapping the likes count opens a screen listing users who liked the post.
- **Save / Unsave**
  - Save posts and manage saved state from the action sheet and post UI.
- **Comments**
  - View comments list and add new comments from the comments screen.

### Stories
- **Create story (image/video)**
  - Upload from gallery or capture via camera.
  - Optional caption.
- **Story viewer**
  - Displays story media full-screen.
  - Tap left/right to navigate.
  - Progress bars and auto-advance when enabled.
- **Auto-play stories setting**
  - Toggle whether stories auto-play and show progress bars.
- **Story actions sheet (long-press on story avatar in Home)**
  - Opens a bottom sheet with actions:
    - **Owner:** View, Delete
    - **Non-owner:** Follow/Unfollow, View

### Profiles & Social Graph
- **Own profile**
  - View profile summary (posts/followers/following) and personal media tabs.
  - Update avatar:
    - Pick from gallery / take photo
    - Remove avatar (sets avatar to default)
- **Other user profile**
  - View user details, follow state, media grid, and counts.
  - Privacy support:
    - Private profiles can require following to view details/content.
  - **Follow/Unfollow** from the profile action row.
  - **Delete follower** option appears when that user follows you (remove them from your followers).
- **Follow lists**
  - Dedicated list screens for followers and following.

### Discovery & Activity
- **Suggestions**
  - Discover accounts to view/follow.
- **Recent likes**
  - Activity-style list of users who liked your posts, with quick navigation.

### Settings, Theme, and Localization
- **Theme toggle**
  - Light/Dark mode using a token-based color system.
- **Language switch (English / Arabic)**
  - Updates app strings globally.
  - RTL layout support when Arabic is selected.
- **Privacy toggle**
  - Switch account between public/private.
- **Polished UI styling**
  - Brand-aligned palette + accents and a signature gradient used for story rings and highlights.

---

## Technologies Used

### Mobile (React Native)
- React Native (CLI)
- React Navigation (Stack/Drawer/Top Tabs)
- AsyncStorage (persist settings like theme/language)
- `react-native-image-picker` (camera/gallery uploads)
- `react-native-video` (video playback)
- `react-native-linear-gradient` (brand gradient accents)
- FontAwesome icons (`@fortawesome/*`)

### Backend
- Node.js + Express (REST API)
- PostgreSQL (relational database)
- Media upload + serving via API (multipart uploads)

---

## App Demo

A demo video is available in the repository at:

- [`./demo/`](./demo/)

Example:
- [`demo/app-demo.mp4`](./demo/app-demo.mp4)

Open the video file locally to watch the demo.

## License

**Important Notice**: This repository is publicly available for viewing only. 
Forking, cloning, or redistributing this project is NOT permitted without explicit permission.