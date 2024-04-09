window.onload = function(){
    fetchMaterialLibrary(1, 30)
        .then(data => {
            renderMaterialList(data);
        })
        .catch(error => {
            console.error('处理响应时出错:', error);
        });
}

const dialog = document.getElementById("deleteDialog");
const snackbar = document.querySelector(".example-snackbar");
const dialogCancelBtn = document.getElementById('dialogCancelBtn');
const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');

function renderMaterialList(data) {
    const materialListTbody = document.getElementById('material-list-tbody');
    materialListTbody.innerHTML = ''; // 清空表格内容

    if (data && data.list && data.list.length > 0) {
        data.list.forEach(item => {
            const tr = document.createElement('tr');

            // 文件名称
            const nameText = document.createElement('td');
            nameText.textContent = item["name"];
            tr.appendChild(nameText);

            // 文件类型
            const materialTypeText = document.createElement('td');
            if (item.type === "PIC") {
                materialTypeText.textContent = "图片";
            } else {
                materialTypeText.textContent = "视频";
            }
            tr.appendChild(materialTypeText);

            // 上传时间
            const uploadTime = new Date(item.uploadTime).toLocaleString();
            const tdUploadTime = document.createElement('td');
            tdUploadTime.textContent = uploadTime;
            tr.appendChild(tdUploadTime);

            // 文件大小
            const sizeInBytes = item.size;
            const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
            const tdSize = document.createElement('td');
            tdSize.textContent = sizeInMB + ' MB';
            tr.appendChild(tdSize);

            // 删除按钮
            const deleteButton = document.createElement('td');
            deleteButton.className = 'div';
            deleteButton.innerHTML = '<mdui-chip>删除</mdui-chip>';
            deleteButton.addEventListener('click', () => {
                dialog.open = true;
                dialog.description = item.name;
                dialogCancelBtn.addEventListener('click', () => {
                    dialog.open = false;
                });
                dialogConfirmBtn.addEventListener('click', () => {
                    dialog.open = false;
                    const token = localStorage.getItem('userToken');
                    if (!token) {
                        window.location.href = '../js';
                    }
                    const params = {
                        id: item.id
                    };
                    fetch('https://api.minelive.top:28080/material', {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok.');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.code === 200) {
                                snackbar.textContent = "删除成功";
                                tr.parentNode.removeChild(tr);
                            } else {
                                snackbar.textContent = data.msg;
                            }
                            snackbar.open = true;
                        })
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });
                });
            });
            tr.appendChild(deleteButton);
            materialListTbody.appendChild(tr); // 将行添加到表格中
        });
    } else {
        materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">没有素材可展示</td></tr>'; // 显示无内容提示
    }
}

async function fetchMaterialLibrary(page = 1, size = 30) {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            window.location.href = '../';
        }
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const url = `https://api.minelive.top:28080/material?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        // 处理请求错误
        console.error('请求素材库时出错:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const streamBtn = document.getElementById('streamBtn'); 
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const logoutBtn = document.getElementById('logoutBtn');
    const token = localStorage.getItem('userToken');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('userToken');
        window.location.href = '../';
    });
    streamBtn.addEventListener('click', function() {
        window.location.href = '../stream';
    });
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];

        if (file) {
            const maxFileSizeInBytes = 60 * 1024 * 1024;
            if (file.size > maxFileSizeInBytes) {
                snackbar.textContent = '文件大小不得超过60MB';
                snackbar.open = true;
            } else {
                snackbar.textContent = "正在上传，请耐心等待";
                snackbar.open = true;
                uploadBtn.loading = true;
                const formData = new FormData();
                formData.append('file', file);
                formData.append('name', file.name.replace(/\s/g, "_"));
                const headers = {
                    'Authorization': `Bearer ${token || 'undefined'}`
                };

                // 发送POST请求
                fetch('https://api.minelive.top:28080/material', {
                    method: 'POST',
                    headers: headers,
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.json(); // 或者根据API响应类型处理
                    })
                    .then(data => {
                        if (data.code === 200) {
                            snackbar.textContent = "上传成功";
                            snackbar.open = true;
                            fetchMaterialLibrary(1, 30)
                                .then(data => {
                                    renderMaterialList(data);
                                })
                                .catch(error => {
                                    console.error('处理响应时出错:', error);
                                });
                        } else {
                            snackbar.textContent = data.msg;
                            snackbar.open = true;
                        }
                        uploadBtn.loading = false;
                    })
                    .catch(error => {
                        snackbar.textContent = "处理上传时发送错误";
                        snackbar.open = true;
                        uploadBtn.loading = false;
                    });
            }
        } else {
            snackbar.textContent = "请选择要上传的文件";
            snackbar.open = true;
        }
    });
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', function() {
        fetchMaterialLibrary(1, 30)
            .then(data => {
                renderMaterialList(data);
            })
            .catch(error => {
                console.error('处理响应时出错:', error);
            });
        snackbar.textContent = "刷新成功";
        snackbar.open = true;
    });
    const groupBtn = document.getElementById('groupBtn');
    groupBtn.addEventListener('click', function() {
        window.open('https://qm.qq.com/q/hpYH0xIsuY', '_blank');
    });
});