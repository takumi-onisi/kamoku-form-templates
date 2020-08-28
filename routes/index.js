var express = require('express');
var router = express.Router();

// 仮想のデータベース
// 授業詳細のデータ
const courses = [
  { name: "大学生の基礎", tani: 1, belong: "導入教育", year: 1, semester: "前期", must: true },
  { name: "一般教養", tani: 2, belong: "導入教育", year: 2, semester: "前期" },
  { name: "心理学", tani: 2, belong: "人文科目", year: 2, semester: "前期" },
  { name: "歴史調査学", tani: 2, belong: "探求科目", year: 2, semester: "前期" },
  { name: "文化史", tani: 2, belong: "探求科目", year: 2, semester: "前期" },
  { name: "財政論", tani: 2, belong: "マネジメント", year: 1, semester: "前期" },
  { name: "演劇と社会", tani: 2, belong: "社会科目", year: 1, semester: "前期" },
  { name: "社会心理学", tani: 2, belong: "社会科目", year: 1, semester: "後期" },
  { name: "異文化社会", tani: 2, belong: "社会科目", year: 1, semester: "後期" },
  { name: "英語1A", tani: 2, belong: "英語", year: 1, semester: "前期", must: true },
  { name: "英語1B", tani: 2, belong: "英語", year: 1, semester: "後期", must: true },
  { name: "英語2A", tani: 2, belong: "英語", year: 2, semester: "前期" },
  { name: "英語2B", tani: 2, belong: "英語", year: 2, semester: "後期" },
  { name: "中国語1A", tani: 2, belong: "中国語", year: 1, semester: "前期", must: true },
  { name: "中国語1B", tani: 2, belong: "中国語", year: 1, semester: "後期", must: true },
  { name: "中国語2A", tani: 2, belong: "中国語", year: 2, semester: "前期" },
  { name: "中国語2B", tani: 2, belong: "中国語", year: 2, semester: "後期" },
  { name: "日本語1A", tani: 2, belong: "日本語", year: 1, semester: "前期", must: true },
  { name: "日本語1B", tani: 2, belong: "日本語", year: 1, semester: "後期", must: true },
]
//科目区分（セクション）のデータ
const kamokuSections = [
  { name: "卒業単位全体", necessary: 120, belong: "科目表", type: 1 },
  { name: "必修科目", necessary: 15, belong: "科目表", type: 1 },
  { name: "全学科目", necessary: 20, belong: "卒業単位全体", type: 1 },
  { name: "学科科目", necessary: 30, belong: "卒業単位全体", type: 1 },
  { name: "導入教育", necessary: 4, belong: "全学科目", type: 2 },
  { name: "人文科目", necessary: 4, belong: "全学科目", type: 2 },
  { name: "探求科目", necessary: 4, belong: "全学科目", type: 2 },
  { name: "マネジメント", necessary: 6, belong: "学科科目", type: 2 },
  { name: "社会科目", necessary: 6, belong: "学科科目", type: 2 },
  { name: "必修外国語", necessary: 8, belong: "学科科目", type: 2 },
  { name: "英語", necessary: 0, belong: "必修外国語", type: 2 },
  { name: "中国語", necessary: 0, belong: "必修外国語", type: 2 },
  { name: "日本語", necessary: 4, belong: "必修外国語", type: 2 },

]
// 追加単位科目のデータ
const additionalTanis =
  [
    { name: "教育学部授業科目", belong: "全学科目", max: 6 },
    { name: "外部検定", belong: "必修外国語", max: 2 },
    { name: "学部内他学科授業科目", belong: "学科科目", max: 6 },
    { name: "他大学連携", belong: "学科科目", max: 6 }
  ];


/*
function makeTreeの説明
kamokuTreeにkamokuSectionsの各要素のname属性を追加していく
科目表の段組みを再現する。belong属性はそのセクションが属する親を指している
kamokuTreeの完成図の例
const kamokuTree = {
  "科目表":{
    "卒業単位全体": {
      "全学科目": {
        "導入教育": {}
      },
      "学科科目": {
        "マネジメント": {},
        "社会科目": {}
      }
    },
    "必修科目":{}
  }
}
*/
function makeTree(kamokuSections, kamokuTree) {
  let data = kamokuSections.slice();
  let keys = Object.keys(kamokuTree);
  for (let key of keys) {
    kamokuTree[key] = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].belong === key) {
        let childName = data[i].name;
        kamokuTree[key][childName] = null;
        data.splice(i, 1)
        i--
      }//if (data[i].belong === key)閉じ
    }
    makeTree(data, kamokuTree[key])
  }//for (let key of keys)
}//function makeTree閉じ


/* GET home page. */
router.get('/calcTaniApp', function (req, res, next) {
  const kamokuTree = {
    "科目表":
      null
  }
  makeTree(kamokuSections, kamokuTree);

  res.render('calcTaniApp/index.ejs',
    {
      courses: courses,
      kamokuSections: kamokuSections,
      kamokuTree: kamokuTree,
      additionalTanis: additionalTanis,
    }
  );
});


module.exports = router;
