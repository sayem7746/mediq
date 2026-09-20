# Launch directory verification log

**Reviewer:** directory-ops-launch-set  
**Verified at:** 2026-09-20T11:00:00.000Z  
**Next review:** 2027-09-20T11:00:00.000Z  
**Relationship:** `published` (public official-source listing, not a signed partner)  
**Sponsored:** all `false` — no written placement contracts  
**Partner claims:** none. No outcomes, rankings, or “best hospital” copy.

Each row was checked against the hospital’s official website on 2026-09-20. Offerings are only taxonomy IDs the official page stated (department, centre, or named specialty). Written provider-agreement confirmation is still required before any `contracted` or `sponsored` flag.

| ID | Display name | City | Official source | Offerings recorded from that page |
| --- | --- | --- | --- | --- |
| hosp-ijn | Institut Jantung Negara | Kuala Lumpur | https://www.ijn.com.my | cardiology, cardiac-surgery, paediatrics |
| hosp-sunway-city | Sunway Medical Centre | Petaling Jaya | https://www.sunwaymedical.com | cardiology, pulmonology, vascular-surgery, oncology, neurology, gastroenterology, hepatology, orthopedics, gynaecology, paediatrics, ophthalmology, urology, rehabilitation, health-check |
| hosp-prince-court | Prince Court Medical Centre | Kuala Lumpur | https://www.princecourt.com | orthopedics, bariatric, cardiology, health-check, oncology, ophthalmology, obstetrics, neurology |
| hosp-gleneagles-kl | Gleneagles Hospital Kuala Lumpur | Kuala Lumpur | https://www.gleneagles.com.my/kuala-lumpur | cardiology, oncology, orthopedics, paediatrics, obstetrics, gynaecology |
| hosp-island | Island Hospital | Penang | https://www.islandhospital.com | cardiology, oncology, radiation-oncology, neurology, paediatrics, gastroenterology, health-check, dental |
| hosp-pantai-kl | Pantai Hospital Kuala Lumpur | Kuala Lumpur | https://www.pantai.com.my/kuala-lumpur | radiation-oncology, neurosurgery, cardiac-surgery, fertility, urology, paediatrics, neurology, obstetrics |
| hosp-thomson-kd | Thomson Hospital Kota Damansara | Petaling Jaya | https://www.thomsonhospitals.com | cardiology, cardiac-surgery, oncology, orthopedics, fertility, gastroenterology, neurology, obstetrics, gynaecology, paediatrics, urology, internal-medicine |
| hosp-pah | Penang Adventist Hospital | Penang | https://www.pah.com.my | oncology, neurology, pulmonology, orthopedics, cardiology, dental, health-check, paediatrics, ophthalmology |
| hosp-beacon | Beacon Hospital | Petaling Jaya | https://www.beaconhospital.com.my | oncology, radiation-oncology, nuclear-medicine, orthopedics, neurology, ophthalmology, urology, gynaecology, health-check |
| hosp-mahkota | Mahkota Medical Centre | Malacca | https://www.mahkotamedical.com | orthopedics, ent, paediatrics, obstetrics, gynaecology, fertility, health-check, cardiology, dental, oncology |
| hosp-gleneagles-penang | Gleneagles Hospital Penang | Penang | https://www.gleneagles.com.my/penang | oncology, cardiology, orthopedics, haematology, gastroenterology, internal-medicine |
| hosp-gleneagles-johor | Gleneagles Hospital Johor | Johor Bahru | https://www.gleneagles.com.my/johor | cardiology, oncology, orthopedics, paediatrics, obstetrics, gynaecology, gastroenterology |
| hosp-pantai-penang | Pantai Hospital Penang | Penang | https://www.pantai.com.my/penang | cardiology, cardiac-surgery, neurology, neurosurgery, orthopedics, radiation-oncology |
| hosp-parkcity | ParkCity Medical Centre | Kuala Lumpur | https://www.parkcitymedicalcentre.com | cardiology, internal-medicine |
| hosp-ummc | University Malaya Medical Centre | Kuala Lumpur | https://www.ummc.edu.my | internal-medicine |
| hosp-hkl | Hospital Kuala Lumpur | Kuala Lumpur | https://hkl.moh.gov.my/en/ | internal-medicine |
| hosp-lohguanlye | LohGuanLye Specialists Centre | Penang | https://www.lohguanlye.com | oncology, radiation-oncology, cardiology, fertility, rehabilitation, haematology, neurology, ent |
| hosp-sunway-velocity | Sunway Medical Centre Velocity | Kuala Lumpur | https://www.sunwaymedical.com/velocity | obstetrics, gynaecology, cardiology, neurology, orthopedics, paediatrics |
| hosp-regency | Regency Specialist Hospital | Johor Bahru | https://www.regencyspecialist.com | cardiology, oncology, orthopedics, endocrinology, bariatric, gynaecology, health-check, nuclear-medicine |
| hosp-pantai-melaka | Pantai Hospital Melaka | Malacca | https://www.pantai.com.my/ayer-keroh | internal-medicine |

MHTC’s public hospital finder (https://www.malaysiahealthcare.org/find-hospital) was used only to locate official hospital sites. It is not stored as a listing source.

## Publish rule

`npm run validate:providers` fails if a published record lacks official source URL, `verifiedAt`, reviewer, or relationship `published` / `contracted`.
