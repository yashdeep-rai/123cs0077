# Priority Notifications Design

This document explains the sorting logic implemented in `notification_app_be/index.ts`.

### Logic
The problem requires sorting incoming notifications based on two criteria:
1. Priority type (Placement > Result > Event)
2. Recency (Newest first)

To do this, I assigned a numerical weight to each type:
- `Placement`: 3
- `Result`: 2
- `Event`: 1

When generating the top 10 list, the array of fetched notifications is sorted. The comparator first checks the weights. If the weights are identical, it falls back to comparing the Unix timestamps of the two objects. After the array is sorted, we simply slice the first 10 elements.

### Performance
Since we are pulling a fixed batch of notifications from an API, sorting the array natively (`Array.prototype.sort`) is completely fine. It runs in $O(N \log N)$ time, which is practically instantaneous for the current payload size. If this were a streaming application dealing with millions of live events, a Min-Heap data structure of size 10 would be more optimal ($O(\log K)$ per insertion), but that adds unnecessary complexity for a simple HTTP pull model.
