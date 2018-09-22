function parseIof(url) {
  return window.fetch(url)
    .then(res => res.text())
    .then(text => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(text, 'application/xml');
      const doc = dom.documentElement;
      const classTags = toArray(doc.getElementsByTagName('ClassStart'));
      const runnerCards = flatten(classTags.map(classTag => {
        const className = classTag.querySelector('Class Name').textContent;
        const teamTags = classTag.querySelectorAll('TeamStart');
        return flatten(toArray(teamTags).map(teamTag => {
          const teamName = teamTag.querySelector('Name').textContent;
          const memberTags = classTag.querySelectorAll('TeamMemberStart');
          return toArray(memberTags).map(memberTag => {
            const person = memberTag.querySelector('Person');
            const startTag = memberTag.querySelector('Start');
            const controlCardTag = startTag.querySelector('ControlCard')
            const controlCard = controlCardTag && controlCardTag.textContent
            return {
              name: `${person.querySelector('Person Name Given').textContent} ${person.querySelector('Person Name Family').textContent}`,
              team: teamName,
              bib: parseInt(startTag.querySelector('BibNumber').textContent),
              className,
              controlCard
            }
          })
        }))
      }))

      return runnerCards.reduce((a, r) => {
        a[r.controlCard] = r;
        return a;
      }, {});
    })
}

const flatten = (xss) => Array.prototype.concat.apply([], xss)

const toArray = l => Array.prototype.slice.call(l)
