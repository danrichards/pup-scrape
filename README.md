## Dev Stories (usage)

> As a dev, I can try the following ...

`$ node index.js same-url-png --help`

`$ node index.js same-url-png -m "bde1d4e19ecd860a099bec0c4cfb9ab6" -u "https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=9400111108435798753938`

`$ node index.js same-url-png -u "https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=9400111108435798753938" -t "https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=9400111108435798753938"`

> As a dev, I can observe the following **FAILS** ...

`$ node index.js same-url-png -m "blerg" -u "https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=9400111108435798753938"`

---

## What will compare in the Puppeteer screenshot?

![croppedUsps](https://user-images.githubusercontent.com/470255/140876588-18bff80a-adbc-4d47-a5ce-26727a40c429.png)

## What will our crop derive from (the screenshot)?

![usps](https://user-images.githubusercontent.com/470255/140876717-a24ada83-c568-4b3e-87eb-71a705d82b49.png)
