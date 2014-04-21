# json2pg

stream JSON objects into postgres, easily

e.g. here's a unix pipeline to load a CSV (`bcsv` converts CSV into JSON)

```
npm install json2pg bcsv -g
cat ~/Downloads/nextbus-1-million.csv | bcsv | json2pg some-table-name
```

`json2pg` expects line delimited JSON (one object per line)
