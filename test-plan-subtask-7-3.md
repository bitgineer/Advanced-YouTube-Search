# Test Plan - Integration of New and Existing Filters

**Subtask:** 7-3 - Verify new filters integrate seamlessly with existing filters
**Test Type:** Manual Browser Testing
**Prerequisites:**
- Tampermonkey or Greasemonkey browser extension installed
- AdvancedYouTubeSearch.user.js loaded in extension
- Access to https://www.youtube.com

---

## Test Environment Setup

### Before Testing:
1. ✅ Open Tampermonkey Dashboard
2. ✅ Ensure AdvancedYouTubeSearch.user.js is installed and enabled
3. ✅ Clear browser cache (optional but recommended)
4. ✅ Open browser DevTools Console (F12) to check for errors

---

## Test Scenarios

### Scenario 1: Exact Term + Resolution Filter
**Purpose:** Verify exact phrase search works with resolution filtering

**Steps:**
1. Open https://www.youtube.com
2. Click "🔍 Advanced Search" button (bottom-right)
3. Fill in form:
   - **Exact Term:** `python tutorial`
   - **Definition/Resolution:** `1080p (Full HD)`
   - Leave all other fields empty/default
4. Click "Search" button
5. Verify URL contains:
   - `search_query=python+tutorial` (or similar encoding)
   - `sp=EgI4AQ%3D%3D` (1080p filter)
6. Verify results:
   - [ ] Videos with exact phrase "python tutorial" appear in results
   - [ ] At least some results are 1080p quality
   - [ ] No console errors

**Expected Result:** Videos matching "python tutorial" filtered to 1080p quality
**Status:** _____

---

### Scenario 2: Exclude Terms + Subtitles + License
**Purpose:** Verify exclude works with feature filters (subtitles, license)

**Steps:**
1. Open Advanced Search popup
2. Fill in form:
   - **Exclude Term(s):** `gaming, clickbait`
   - **Subtitles/Captions:** `Has Captions`
   - **License:** `Creative Commons`
   - Leave all other fields empty/default
3. Click "Search"
4. Verify URL contains:
   - `search_query=-gaming+-clickbait` (or similar encoding)
   - `sp=EgIoAQ%3D%3D` (subtitles filter)
   - `sp=EgIwAQ%3D%3D` (Creative Commons filter)
5. Verify results:
   - [ ] Results don't contain "gaming" or "clickbait" in title/description
   - [ ] Video thumbnails show CC icon (subtitles available)
   - [ ] Videos are licensed under Creative Commons (check video description)
   - [ ] No console errors

**Expected Result:** Videos excluding gaming/clickbait, with captions and Creative Commons license
**Status:** _____

---

### Scenario 3: Title Includes + Custom Duration + Live Content
**Purpose:** Verify title search works with custom duration and live filtering

**Steps:**
1. Open Advanced Search popup
2. Fill in form:
   - **Title Includes:** `review, analysis`
   - **Custom Duration - Min:** `5`
   - **Custom Duration - Max:** `15`
   - **Live Content:** `Live Only`
   - **Video Length:** `Any Length` (important - custom duration requires this)
   - Leave all other fields empty/default
3. Click "Search"
4. Verify URL contains:
   - `intitle:review` and `intitle:analysis` (or similar encoding)
   - `sp=EgIYAw%3D%3D` (medium duration, mapped from 5-15 min)
   - `sp=EgJIAQ%3D%3D` (live filter)
5. Verify results:
   - [ ] Video titles contain "review" or "analysis"
   - [ ] Videos are live streams or upcoming live streams
   - [ ] Duration is approximately 5-15 minutes (if applicable)
   - [ ] No console errors

**Expected Result:** Live videos with "review" or "analysis" in title, 5-15 minutes long
**Status:** _____

---

### Scenario 4: Date Range + Resolution + All Features
**Purpose:** Verify comprehensive filter combination works

**Steps:**
1. Open Advanced Search popup
2. Fill in form:
   - **Regular Search:** `documentary`
   - **Exact Term:** `climate change`
   - **Exclude Term(s):** `conspiracy`
   - **Date After:** `2023-01-01`
   - **Date Before:** `2024-01-01`
   - **Definition/Resolution:** `2160p (4K)`
   - **Subtitles/Captions:** `Has Captions`
   - **License:** `Creative Commons`
   - Leave other fields empty/default
3. Click "Search"
4. Verify URL contains:
   - Query with "documentary", exact phrase "climate change", exclude "conspiracy"
   - `after:2023-01-01` and `before:2024-01-01`
   - `sp=EgIyAQ%3D%3D` (2160p filter)
   - `sp=EgIoAQ%3D%3D` (subtitles filter)
   - `sp=EgIwAQ%3D%3D` (Creative Commons filter)
5. Verify results:
   - [ ] Results are documentaries about climate change
   - [ ] No "conspiracy" related content
   - [ ] Videos published between Jan 1, 2023 and Jan 1, 2024
   - [ ] High quality (2160p if available)
   - [ ] CC icon on thumbnails
   - [ ] Creative Commons license in video descriptions
   - [ ] No console errors

**Expected Result:** Comprehensive filter application across all new and existing filters
**Status:** _____

---

### Scenario 5: All Existing Filters + All New Filters
**Purpose:** Stress test - maximum filter combination

**Steps:**
1. Open Advanced Search popup
2. Fill in form with ALL filters:
   - **Regular Search:** `machine learning course`
   - **Exact Term:** `deep learning`
   - **Exclude Term(s):** `clickbait, beginner`
   - **Title Includes:** `advanced, python`
   - **Video Length:** `Over 20 minutes`
   - **Definition/Resolution:** `1080p (Full HD)`
   - **Date After:** `2022-01-01`
   - **Date Before:** `2025-01-01`
   - **Subtitles/Captions:** `Has Captions`
   - **License:** `Creative Commons`
   - Leave Live Content as "Any" and Custom Duration empty
3. Click "Search"
4. Verify URL contains ALL filters encoded:
   - Query string with search terms, exclusions, title includes, dates
   - `sp=EgIYAg%3D%3D` (long duration)
   - `sp=EgI4AQ%3D%3D` (1080p)
   - `sp=EgIoAQ%3D%3D` (subtitles)
   - `sp=EgIwAQ%3D%3D` (Creative Commons)
5. Verify results:
   - [ ] All search criteria met (machine learning, deep learning, advanced, python)
   - [ ] Excluded terms (clickbait, beginner) not present
   - [ ] Title includes "advanced" or "python"
   - [ ] Duration > 20 minutes
   - [ ] Resolution 1080p or higher
   - [ ] Published between 2022-01-01 and 2025-01-01
   - [ ] Has captions available
   - [ ] Creative Commons licensed
   - [ ] No console errors

**Expected Result:** Highly filtered results matching all criteria
**Status:** _____

---

### Scenario 6: Empty Existing Filters + All New Filters
**Purpose:** Verify new filters work standalone (without query filters)

**Steps:**
1. Open Advanced Search popup
2. Fill in form with ONLY new filters:
   - Leave **Regular Search** empty
   - Leave **Exact Term** empty
   - Leave **Exclude Term(s)** empty
   - Leave **Title Includes** empty
   - Leave **Date After** empty
   - Leave **Date Before** empty
   - **Definition/Resolution:** `720p (HD)`
   - **Subtitles/Captions:** `Has Captions`
   - **Live Content:** `Live Only`
   - **License:** `Creative Commons`
   - Leave **Video Length** as "Any Length"
   - Leave **Custom Duration** empty
3. Click "Search"
4. Verify URL contains:
   - `search_query=` (empty or minimal)
   - `sp=EgIgAQ%3D%3D` (720p filter)
   - `sp=EgIoAQ%3D%3D` (subtitles filter)
   - `sp=EgJIAQ%3D%3D` (live filter)
   - `sp=EgIwAQ%3D%3D` (Creative Commons filter)
5. Verify results:
   - [ ] Results are live streams (Live or Upcoming)
   - [ ] At least 720p quality
   - [ ] Have captions/subtitles
   - [ ] Creative Commons licensed
   - [ ] No console errors

**Expected Result:** Results filtered only by new sp parameter filters, no query filters
**Status:** _____

---

### Scenario 7: All Existing Filters + Empty New Filters
**Purpose:** Verify existing filters still work when new filters are default

**Steps:**
1. Open Advanced Search popup
2. Fill in form with ONLY existing filters:
   - **Regular Search:** `web development`
   - **Exact Term:** `react tutorial`
   - **Exclude Term(s):** `outdated, 2020`
   - **Title Includes:** `beginner, full course`
   - **Video Length:** `4-20 minutes`
   - **Date After:** `2023-06-01`
   - Leave **Date Before** empty
   - Set all new filters to "Any" (Resolution, Subtitles, Live, License)
   - Leave **Custom Duration** empty
3. Click "Search"
4. Verify URL contains:
   - Query with all existing filters encoded
   - `sp=EgIYAw%3D%3D` (medium duration from Video Length dropdown)
   - No other sp parameters (or minimal if YouTube adds defaults)
5. Verify results:
   - [ ] Results match "web development" and exact phrase "react tutorial"
   - [ ] Don't include "outdated" or "2020"
   - [ ] Titles contain "beginner" or "full course"
   - [ ] Duration is 4-20 minutes
   - [ ] Published after June 1, 2023
   - [ ] No console errors

**Expected Result:** Results filtered only by existing query and duration filters
**Status:** _____

---

## Edge Case Tests

### Edge Case 1: Special Characters in Exact Term
**Steps:**
1. Open Advanced Search
2. Set **Exact Term:** `"C++ programming"` (contains plus sign)
3. Set **Resolution:** `1080p`
4. Click Search
5. Verify:
   - [ ] URL is properly encoded
   - [ ] Results match exact phrase with special characters
   - [ ] 1080p filter applied
   - [ ] No console errors

**Expected Result:** Special characters properly handled
**Status:** _____

---

### Edge Case 2: Custom Duration Override Logic
**Steps:**
1. Open Advanced Search
2. Set **Video Length:** `Short` (under 4 minutes)
3. Set **Custom Duration - Min:** `10`
4. Set **Custom Duration - Max:** `20`
5. Set **Resolution:** `720p`
6. Click Search
7. Verify URL contains:
   - `sp=EgIYAQ%3D%3D` (short from Video Length preset)
   - NOT medium (custom duration should be ignored)
8. Note: This is expected behavior per implementation

**Expected Result:** Video Length preset takes precedence when both are set
**Status:** _____

---

### Edge Case 3: Non-Implemented Options
**Steps:**
1. Open Advanced Search
2. Set **Regular Search:** `test video`
3. Set **Subtitles/Captions:** `No Captions` (not implemented)
4. Set **Live Content:** `Exclude Live` (not implemented)
5. Set **License:** `Standard YouTube License` (default, no filter)
6. Click Search
7. Verify URL:
   - Contains `search_query=test+video`
   - Does NOT contain sp parameters for subtitles or live
8. Verify:
   - [ ] Search works normally
   - [ ] Non-implemented options are silently ignored
   - [ ] No console errors

**Expected Result:** Non-implemented options don't cause errors, just don't filter
**Status:** _____

---

## Additional Verification Tests

### UI Consistency Check
**Purpose:** Verify new filters feel integrated with existing filters

**Tests:**
- [ ] All filters appear in same form (no separate popups)
- [ ] Styling is consistent across all fields
- [ ] Tooltips appear on all new filter labels
- [ ] Custom Duration section is visually distinct
- [ ] Form submits without validation errors
- [ ] All dropdowns have correct options

**Status:** _____

---

### Backward Compatibility Check
**Purpose:** Verify existing filters still work as before

**Tests:**
1. Test **Exact Term** alone (no new filters)
   - [ ] Works as expected
2. Test **Exclude** alone (no new filters)
   - [ ] Works as expected
3. Test **Title Includes** alone (no new filters)
   - [ ] Works as expected
4. Test **Date Range** alone (no new filters)
   - [ ] Works as expected
5. Test **Video Length** dropdown (original feature)
   - [ ] Works as expected

**Status:** _____

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Tampermonkey installed
- [ ] Userscript installed and enabled
- [ ] Browser console open for error monitoring
- [ ] Test document ready for notes

### Test Execution
- [ ] Scenario 1: Exact Term + Resolution
- [ ] Scenario 2: Exclude + Subtitles + License
- [ ] Scenario 3: Title + Custom Duration + Live
- [ ] Scenario 4: Date Range + Resolution + All Features
- [ ] Scenario 5: All Filters (Stress Test)
- [ ] Scenario 6: New Filters Only
- [ ] Scenario 7: Existing Filters Only
- [ ] Edge Case 1: Special Characters
- [ ] Edge Case 2: Custom Duration Override
- [ ] Edge Case 3: Non-Implemented Options
- [ ] UI Consistency Check
- [ ] Backward Compatibility Check

### Post-Test Documentation
- [ ] All test scenarios documented with status
- [ ] Any issues or anomalies recorded
- [ ] Console errors (if any) documented
- [ ] YouTube-specific behaviors noted
- [ ] Screenshots taken (if issues found)

---

## Expected YouTube Behavior

### URL Format
All test scenarios should generate URLs in this format:
```
https://www.youtube.com/results?
  search_query=<encoded_query_filters>
  &sp=<filter_value>
  &sp=<another_filter_value>
```

### Multiple sp Parameters
YouTube's behavior with multiple sp parameters is **undocumented**. This test plan will verify whether:
- ✅ YouTube accepts and applies all sp parameters
- ⚠️ YouTube only applies the first/last sp parameter
- ⚠️ YouTube ignores some sp parameter combinations

### Filter Intersection
When multiple filters are applied, results should be the **intersection** of all criteria (i.e., must match ALL filters, not just ANY).

---

## Success Criteria

### Pass Criteria
- [ ] All 7 main scenarios produce valid YouTube search URLs
- [ ] All combinations work without JavaScript errors
- [ ] Results reflect applied filters (intersection)
- [ ] UI remains consistent and responsive
- [ ] Backward compatibility maintained

### Fail Criteria
- [ ] Any scenario produces JavaScript errors
- [ ] Filter combinations cause unexpected behavior
- [ ] YouTube rejects the generated URLs
- [ ] Existing filters stop working correctly

### Partial Pass Criteria
- [ ] Most scenarios work, but YouTube-specific quirks exist
- [ ] Some undocumented resolution filters don't work
- [ ] Non-implemented options ("No Captions", "Exclude Live") confuse users

---

## Issue Logging

If any issues are found, document:

### Issue Template
```
Issue: [Brief description]
Scenario: [Which test scenario]
Steps to Reproduce: [Detailed steps]
Expected Behavior: [What should happen]
Actual Behavior: [What actually happened]
URL Generated: [The actual URL]
Console Errors: [Any JavaScript errors]
Screenshots: [If applicable]
Severity: [Critical / High / Medium / Low]
Status: [New / Confirmed / Known Limitation]
```

---

## Notes

### Known Limitations (from code analysis)
1. "No Captions" option doesn't generate filter (YouTube limitation)
2. "Exclude Live" option doesn't generate filter (YouTube limitation)
3. Custom duration only works when Video Length is "Any"
4. Undocumented resolution filters (360p, 480p, 1080p, 1440p, 2160p) may not work

### Expected Outcomes (from code analysis)
- ✅ All combinations should work at code level
- ✅ No JavaScript errors expected
- ⚠️ YouTube's handling of multiple sp parameters needs verification
- ⚠️ Undocumented resolution filters may not work in practice

---

## Test Completion Sign-Off

**Tester:** ______________________

**Test Date:** ______________________

**Overall Result:** _____ PASS / FAIL / PARTIAL

**Summary of Findings:**
_________________________________________________________________________
_________________________________________________________________________
_________________________________________________________________________

**Recommendations:**
_________________________________________________________________________
_________________________________________________________________________
_________________________________________________________________________

**Sign-off:** ______________________

---

**Test Plan Version:** 1.0
**Last Updated:** 2025-01-14
**Document Status:** Ready for Execution
