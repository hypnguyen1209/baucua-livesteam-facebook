(() => {
    const IDPOST = '123'; //ID post
    const TOKEN = 'EAAA'; // access_token 
    async function getDataComment() {
        let data = await fetch(`https://graph.facebook.com/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-FB-Friendly-Name': 'StaticFeedbackBatchQuery',
                'Host': 'graph.facebook.com',
                'User-Agent': '[FBAN/FB4A;FBAV/265.0.0.61.103;FBBV/208173480;FBDM/{density=1.5,width=720,height=1280};FBLC/en_US;FBRV/208843946;FBCR/Viettel Telecom;FBMF/samsung;FBBD/samsung;FBPN/com.facebook.katana;FBDV/SM-G965N;FBSV/5.1.1;FBOP/1;FBCA/x86:armeabi-v7a;]',
                'X-FB-Net-HNI': '45204',
                'X-FB-SIM-HNI': '45204',
                'Authorization': 'OAuth '+TOKEN,
                'X-FB-Connection-Type': 'WIFI',
                'X-FB-Socket-Option': 'TCP_CONGESTION=bbr',
                'X-Tigon-Is-Retry': 'False',
                'Accept-Encoding': 'gzip, deflate',
                'X-FB-HTTP-Engine': 'Liger',
                'Connection': 'keep-alive'
            },
            body: 'doc_id=2932209506837777&method=post&locale=en_US&pretty=false&format=json&variables=%7B%22profile_image_size%22%3A60%2C%22nt_context%22%3A%7B%22using_white_navbar%22%3Atrue%2C%22styles_id%22%3A%22889d3c7580240c714beae5571dc2244a%22%2C%22pixel_ratio%22%3A1.5%7D%2C%22media_type%22%3A%22image%2Fx-auto%22%2C%22image_medium_width%22%3A360%2C%22image_low_width%22%3A240%2C%22reading_attachment_profile_image_height%22%3A203%2C%22include_comment_depth%22%3Atrue%2C%22enable_comment_shares%22%3Atrue%2C%22enable_comment_voting%22%3Atrue%2C%22angora_attachment_cover_image_size%22%3A720%2C%22enable_comment_reactions%22%3Atrue%2C%22in_channel_eligibility_experiment%22%3Afalse%2C%22reading_attachment_profile_image_width%22%3A135%2C%22enable_comment_reactions_icons%22%3Atrue%2C%22size_style%22%3A%22contain-fit%22%2C%22include_surround_comment_ntview%22%3Afalse%2C%22image_medium_height%22%3A2048%2C%22feedback_id%22%3A%22'+encodeURIComponent(btoa(`feedback:${IDPOST}`))+'%22%2C%22image_high_height%22%3A2048%2C%22fetch_available_comment_orderings%22%3Atrue%2C%22image_high_width%22%3A720%2C%22fetch_comment_inline_survey%22%3Atrue%2C%22enable_ranked_replies%22%3A%22true%22%2C%22max_comment_replies%22%3A0%2C%22image_low_height%22%3A2048%2C%22enable_comment_replies_most_recent%22%3A%22true%22%2C%22scale%22%3A%221.5%22%2C%22profile_pic_media_type%22%3A%22image%2Fx-auto%22%2C%22highlighted_reaction_image_size%22%3A240%2C%22angora_attachment_profile_image_size%22%3A60%2C%22max_comments%22%3A16%7D&fb_api_req_friendly_name=StaticFeedbackBatchQuery&fb_api_caller_class=graphservice&fb_api_analytics_tags=%5B%22GraphServices%22%5D&server_timestamps=true'
        });
        return await data.json();
    }
    setInterval(() => {
        getDataComment()
        .then(execGetComment)
        .catch(err => {
            console.log(err)
        })
    }, 1000);    
    function execGetComment(res) {
        res.data.node.top_level_comments.nodes.map((item, index) => {
            let itemComment = document.getElementsByClassName('item-cmt')[index];
            itemComment.querySelector('img').src = item.author.profile_picture.uri;
            itemComment.querySelector('.text-comment span a').innerHTML = item.author.name;
            itemComment.querySelector('.text-comment span a').href = `https://fb.com/${item.author.id}`;
            itemComment.querySelector('.text-comment p').innerHTML = (item.body) ? ((item.body.text.length > 40) ? `${item.body.text.split('').slice(0, 40).join('')} ...` : item.body.text) : 'send an attachment';
            itemComment.querySelector('img').alt = item.author.id+'_'+item.legacy_fbid;
        })
    }
})()
