 let inputElement = document.getElementById('fileInput');/*getElementById()方法的用途是寻找一个有着给定id属性值的元素：*/
 let imgBtn = document.getElementById('getImgBtn');
 let img = new Image();
 let loading = true;
 let x = document.getElementById('myRange');/*二值化范围*/
 let r = 0;//信号量
 let p = 0;//信号量
 let q = 1;//信号量
 let fileOrder = 0;//表格操作次序
 let name = 0;//下载文件名称
 document.getElementById("demo").innerHTML = x.value;/*二值化数值显示*/
 inputElement.addEventListener('change', (e) => {img.src = URL.createObjectURL(e.target.files[0]);q = 1;}, false);/*输入图像显示
 addEventListener() 方法用于向指定元素添加监听事件。且同一元素目标可重复添加，不会覆盖之前相同事件
 change 该事件在表单元素的内容改变时触发( , , , 和 )
 click 当用户点击某个对象时调用的事件句柄。*/
 x.addEventListener('change',(e) => {p = x.value;document.getElementById("demo").innerHTML = p ;p = parseFloat(p);q = 1;r = 0;}, false);/*二值化数值范围*/
 
 img.onload = function() {
      let inCanvas = document.getElementById('canvasInput')
      let fullinCanvas = document.getElementById('fullImgInput')
      let inCanvasCtx = inCanvas.getContext('2d')/*创建内置的2d对象*/
      let infullCanvasCtx =fullinCanvas.getContext('2d')
      fullinCanvas.width = img.width
      fullinCanvas.height = img.height
      inCanvasCtx.drawImage(img,0,0,img.width,img.height,0,0,650,450)/*drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight,
       destX, destY, destWidth, destHeight)*/
      infullCanvasCtx.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height)
     };

 getImgBtn.addEventListener('click', (e) => {
      if(loading) {
      return alert('正在加载opencv.js和模型文件')
      }
      if(!img.src) {
      return alert('请先上传图片')
      }
      let src = cv.imread('canvasInput');/*imread功能是加载图像文件成为一个Mat对象，其中第一个参数表示图像文件名称,第二个参数表示加载的图像类型，支持常见的三个参数值*/
      let src1 = cv.imread('fullImgInput')
      let gray = new cv.Mat();/*Mat可以理解为一个存储数据的容器*/
      let gray1 = new cv.Mat();
      let gray2 = new cv.Mat();
      let gray3 = new cv.Mat();
      cv.CvtColor(src, gray, cv.COLOR_BGR2GRAY); /*cv.CvtColor：将数组的通道从一个颜色空间转换另外一个颜色空间*/
      cv.CvtColor(src1, gray1, cv.COLOR_BGR2GRAY);  
      cv.Threshold (gray, gray2, p, 255, cv.THRESH_BINARY);/*cv.Threshold：图像阈值化*/
      cv.Threshold (gray1, gray3 , p, 255, cv.THRESH_BINARY);
      cv.imshow('canvasOutput',gray2);/*根据图像的深度，imshow函数会自动对其显示灰度值进行缩放。参数1：显示图片的canvas名称。参数2：储存图片数据的对象。*/
      cv.imshow('fullImgOutput',gray3);
      r = 1;
      src.delete();src1.delete();gray.delete();gray1.delete();gray2.delete();gray3.delete();
     });
 
 erode.addEventListener('click',(e) =>{
      if(!r){
      return alert('请先应用二值化image binaryzation')
      }
      let src = cv.imread('canvasOutput');
      let src1 = cv.imread('fullImgOutput')
      let dst = new cv.Mat();
      let dst1 = new cv.Mat();
      let M = cv.Mat.ones(2, 2, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      // You can try more different parameters
      cv.Erode(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());/*cv.Erode：形态腐蚀*/
      cv.Erode(src1, dst1, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
      cv.imshow('canvasOutput', dst);
      cv.imshow('fullImgOutput', dst1);
      src.delete();src1.delete();dst.delete(); M.delete();dst1.delete();
     })

 dilate.addEventListener('click',(e) =>{
      if(!r){
      return alert('请先应用二值化')
       }
      let src = cv.imread('canvasOutput');
      let src1 = cv.imread('fullImgOutput')
      let dst = new cv.Mat();
      let dst1 = new cv.Mat();
      let M = cv.Mat.ones(2, 2, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      // You can try more different parameters
      cv.Dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());/*cv.Dilate：形态学膨胀*/
      cv.Dilate(src1, dst1, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
      cv.imshow('canvasOutput', dst);
      cv.imshow('fullImgOutput', dst1);
      src.delete();src1.delete();dst.delete(); M.delete();dst1.delete();
     })

 contourm.addEventListener('click',(e) =>{
      if(!r){
      return alert('请先应用二值化')
      }
      if(q){
      q = 0;
      let src = cv.imread('canvasOutput');
      let src1 = cv.imread('fullImgOutput');
      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      let dst1 = cv.Mat.zeros(src1.rows, src1.cols, cv.CV_8UC3);
      cv.CvtColor(src, src, cv.COLOR_BGR2GRAY);
      cv.CvtColor(src1, src1, cv.COLOR_BGR2GRAY);
      let contours = new cv.MatVector();
      let contours1 = new cv.MatVector();
      let hierarchy = new cv.Mat();
      let hierarchy1 = new cv.Mat();
      // You can try more different parameters
      cv.FindContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);/*cv.FindContours：从二值图像中寻找轮廓*/
      cv.FindContours(src1, contours1, hierarchy1, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      let color = new cv.Scalar(255,255,0);
      for (let i = 0; i < contours.size(); ++i) {
      cv.DrawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);/*cv.DrawContours：绘制轮廓；*/
      }
      for (let i = 0; i < contours1.size(); ++i){
      cv.DrawContours(dst1, contours1, i, color, 1, cv.LINE_8, hierarchy1, 100);
      }
      cv.imshow('canvasOutput', dst);
      cv.imshow('fullImgOutput', dst1);

      let cnt = new cv.Mat();
      let area = 0;
      for (let i = 0; i < contours1.size();++i)
      {
      cnt = contours1.get(i);
      area = area + cv.contourArea(cnt);
      }
      areaOutput.innerHTML = area;
      parseFloat(area);
      var table = document.getElementsByTagName('table')[0];
      var tr = document.createElement('tr');
      var ratio = 100*area/(img.height*img.width);
      tr.innerHTML = "<td>"+(++fileOrder)+"</td><td>"+area+"</td><td>"+ratio.toFixed(2)+"</td>";
      table.appendChild(tr);
      src.delete(); dst.delete(); contours.delete(); hierarchy.delete();contours1.delete(); hierarchy1.delete();src1.delete();dst1.delete();
      }
      else
      return alert('更改图像或二值化参数后再试试吧');
     })
 
 save.addEventListener('click',(e) =>{
      if(!img.src)
      {
      return alert('请先上传图片')
      }
      let event = new MouseEvent('click');//创建单击事件
      const canvas = document.getElementById('fullImgOutput');
      url = canvas.toDataURL('image/png');
      let a = document.createElement("a"); // 生成一个a元素 
      a.download = (++name)+'.png' || "photo"; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性    
      a.dispatchEvent(event);
     })    
 
 function onOpenUtilsReady() {
      let utils = new Utils('errorMessage');
      utils.loadOpenCv(() => {
      let cvFile = 'opencv_js.js';
      utils.createFileFromUrl(cvFile, cvFile, () => {
      document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
      loading = false;
       });
      })
     }   
     
     function onOpenCvReady(){
     document.getElementById("status").innerHTML="opencv.js is ready.";
 }
    



 <script async src="opencv.js" onload="onOpenCvReady();" type="text/javascript"></script>