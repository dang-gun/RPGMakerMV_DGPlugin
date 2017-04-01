//=============================================================================
// DangGun Plugins - Bettle Command
// DG_BettleCommand.js
//=============================================================================

var Imported = Imported || {};
Imported.DG_BettleCommand = true;

var DangGun = DangGun || {};
DangGun.BettleCommand = DangGun.BettleCommand || {};
DangGun.BettleCommand.version = 1.00;

//=============================================================================
/*:
* @plugindesc 전투창의 명령어를 제어합니다.
* @author Dang-Gun Roleeyas ( http://blog.danggun.net/ )
*
* @param Show Attack
* @desc 공격 명령을 보일지 여부
* Yes - true, No - false
* Default: true
* @default true
* 
* @param Show Guard
* @desc 방어 명령을 보일지 여부
* Yes - true, No - false
* Default: true
* @default true
* 
* @param Show Skill
* @desc 스킬이 있는 경우에만 스킬 명령을 보일지 여부
* Yes - true, No - false
* Default: false
* @default false
*
* @help
* ============================================================================
* Introduction
* ============================================================================
*
* 전투창의 명령어를 제어합니다.
* 공격명령과 방어 명령을 제어합니다.
* 사용 가능한 스킬이 없는 경우 해당 명령을 지우는 기능을 사용 할 수 있습니다.
* (단, 사용 가능한 스킬이 많아질 경우 성능 이슈가 발생할 수 있습니다.)
*
* No Attack / Guard v1.1 (http://pastebin.com/zsntWMAP)를 참고 하여 만들었습니다.
* TamFey님 감사합니다.
*
* ============================================================================
* Changelog
* ============================================================================
*
* Version 1.00:
* - Finished plugin!
*/
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================
DangGun.Parameters = PluginManager.parameters("DG_BettleCommand");
DangGun.BettleCommand = DangGun.BettleCommand || {};

DangGun.BettleCommand.ShowAttack = String(DangGun.Parameters["Show Attack"]);
DangGun.BettleCommand.ShowAttack = eval(DangGun.BettleCommand.ShowAttack);

DangGun.BettleCommand.ShowGuard = String(DangGun.Parameters["Show Guard"]);
DangGun.BettleCommand.ShowGuard = eval(DangGun.BettleCommand.ShowGuard);

DangGun.BettleCommand.ShowSkill = String(DangGun.Parameters["Show Skill"]);
DangGun.BettleCommand.ShowSkill = eval(DangGun.BettleCommand.ShowSkill);

(function () {

	//액터 명령창을 만들때
	Scene_Battle.prototype.createBettleCommandWindow = function ()
	{
		//console.log(DangGun.BettleCommand.ShowAttack + " " + DangGun.BettleCommand.ShowGuard);

		//엑터 커맨드 만드는 객체를 내가 만든 객체로 바꾼다.
		this._BettleCommandWindow = new Window_BettleCommand();

		if (true === DangGun.BettleCommand.ShowAttack)
		{//공격 커맨드 바인딩
			this._BettleCommandWindow.setHandler('attack', this.commandAttack.bind(this));
		}

		//스킬 커맨드 바인딩
		this._BettleCommandWindow.setHandler('skill', this.commandSkill.bind(this));

		if (true === DangGun.BettleCommand.ShowGuard)
		{//방어 커맨드 바인딩
			this._BettleCommandWindow.setHandler('guard', this.commandGuard.bind(this));
		}

		//아이템 커맨드 바인딩
		this._BettleCommandWindow.setHandler('item', this.commandItem.bind(this));

		//취소 커맨드 바인딩
		this._BettleCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));

		//창표시
		this.addWindow(this._BettleCommandWindow);
	};

	//액터 명령창을 만들기
	//스크롤할때도 발생한다.
	Window_BettleCommand.prototype.makeCommandList = function ()
	{
		if (this._actor)
		{//엑터가 있을때
			if (true === DangGun.BettleCommand.ShowAttack)
			{//공격 명령 추가
				this.addAttackCommand();
			}

			//스킬 명령 추가
			//this.addSkillCommands();
			{//커스텀한 스킬 명령 추가
				//스킬이 포함된 타입 리스트
				var arrMySkillType = ActorSkillsType(this._actor._skills);

				//사용가능한 스킬 타입 리스트
				var skillTypes = this._actor.addedSkillTypes();
				//정렬
				skillTypes.sort(function(a, b){return a-b});
				skillTypes.forEach(function (stypeId)
				{
					if ((false === DangGun.BettleCommand.ShowSkill)
						|| (undefined !== arrMySkillType[stypeId]))
					{//스킬이 있을때만 보일지 여부
						//받은 스킬타입이 리스트에 있다.
						var name = $dataSystem.skillTypes[stypeId];
						this.addCommand(name, 'skill', true, stypeId);
					}
				}, this);
			}
			
			
			if (true === DangGun.BettleCommand.ShowGuard)
			{//가드 명령 추가
				this.addGuardCommand();
			}

			//아이템 명령 추가
			this.addItemCommand();
		}
	};

	/** @description	액터가 가지고 있는 스킬의 타입을 간추립니다.
	 * @param {array}	액터가 가지고 있는 스킬리스트
	 * @return {json}
	 */
	function ActorSkillsType(arrSkills)
	{
		var arrResult = {};
		
		//가지고 있는 스킬의 타입을로 배열을 만든다.
		arrSkills.forEach(function (nIndex)
		{
			arrResult[$dataSkills[nIndex].stypeId] = true;
		}, this);

		return arrResult;
	}

})();

