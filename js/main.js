(function() {
    const subjectUrl = 'http://localhost:3000/api/book/maths';
    const lessonsUrl = 'http://localhost:3000/api/book/maths/section/';

    const apiCall = (url) => {
        return fetch(url)
        .then(res => res.json())
        .then(res => res.response)
    }

    const setAccordion = () => {
        let acc = document.getElementsByClassName("accordion");
        let i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                
                let panel = this.children[2];
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                } 
            });
        }
    }

    const progressBar = (percent) => {

        const bar = document.createElement('div');
        bar.innerHTML = `Completed: ${percent} %`;
        bar.classList.add("progress");

        return bar;
    }
    
    const subFragments = (list, parentSequence) => {
        let fragment = new DocumentFragment();
        const panel = document.createElement('div');
        panel.classList.add("panel");

        list.forEach((el, index) => {
            const section = document.createElement('div');
            section.innerHTML = `${parentSequence}.${index+1}. ${el.title}`;
            section.setAttribute('id', el.id);
            el.status === 'COMPLETE' ? section.classList.add('panel-list', 'complete') : section.classList.add('panel-list');
            panel.appendChild(section);
        });
        return fragment.appendChild(panel);
    }

    const getMainFragments = (list) => {
        let fragment = new DocumentFragment();
        list.forEach((el, index) => {
            const main = document.createElement('div');
            main.classList.add("accordion");

            const para = document.createElement('p');
            para.innerHTML = index+1 + '. ' + el.title;
            para.setAttribute('id', el.id);
            para.classList.add("title");

            main.appendChild(para);

            if (el.type === 'chapter') {
                const percent = Math.ceil(el.completeCount / el.childrenCount * 100);
                main.appendChild(progressBar(percent));

                apiCall(`${lessonsUrl}${el.id}`)
                .then(response => {                
                    main.appendChild(subFragments(response[el.id], index+1));
                });
            }

            fragment.appendChild(main);
        });
        return fragment;
    }

    apiCall(subjectUrl)
    .then(response => {
        let parentElement = document.getElementById('maths');
        let parentFragment = getMainFragments(response);

        parentElement.appendChild(parentFragment);

        setAccordion();
    });


})();