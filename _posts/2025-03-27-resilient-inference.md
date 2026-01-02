---
layout: post
title:          "Resilient Inference for Personalized Federated Learning in Edge Environments"
date:           2025-03-27 00:02:00 +0800
selected:       true
pub:            "45th IEEE International Conference on Distributed Computing Systems (ICDCS 2025)"
pub_date:       "2025"
category: conference
authors:
- Ke Xiao
- Qiyuan Wang
- Christos Anagnostopoulos
- Kevin Bryson
pdf:       "https://ieeexplore.ieee.org/document/11262692"
links:
  # Paper: https://www.cell.com
---
### Abstract

Federated Learning (FL) and Edge Computing (EC) offer innovative approaches to enable distributed learning systems that prioritize data privacy and low-latency communication.
Personalized FL (PFL) enhances traditional FL by tailoring models to the needs of each participant and improving local inference performance. Given the resource constraints and potential for edge node failures, optimized inference task rescheduling mechanisms play a crucial role in ensuring resilience in inference services.
Existing methods often ignore the impact of the inherent model differences on inferential tasks leading to suboptimal personalization in EC. 
To address this challenge, we propose a framework, SOIR, which effectively integrates model similarity into the rescheduling process. The inference task rescheduling problem in EC is formulated with a Mixed Integer Nonlinear Programming (MINLP) model, and an efficient algorithm is introduced to solve it. Our experimental results showcase the applicability and effectiveness of SOIR in FL-based resilient EC environments.

### Poster

<object data="{{ '/assets/images/48poster.pdf' | relative_url }}"
        type="application/pdf"
        style="width: 100%; min-height: 720px; display: block; border-radius: 8px; border: 1px solid var(--card-border); background: #0b0b0f;">
  <p style="padding: 16px;">
    Click <a href="{{ '/assets/images/48poster.pdf' | relative_url }}" target="_blank" rel="noopener"> Get the poster</a>
  </p>
</object>
