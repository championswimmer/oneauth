# SEEDS

## Seeding the DB with Country/States Data

```shell
node scripts/seed/countries.js
node scripts/seed/states.js
```
NOTES :

1. Run states after countries (it needs India to be present in DB)
2. If ran again, no problem. Duplicates are not created
